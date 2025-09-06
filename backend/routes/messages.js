const express = require('express');
const { Message, Conversation } = require('../models/Message');
const auth = require('../middleware/auth');
const { validateMessage, handleValidationErrors } = require('../middleware/validation');
const router = express.Router();

// Get user's conversations
router.get('/conversations', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      type = 'all',
      archived = 'false'
    } = req.query;

    const skip = (page - 1) * limit;

    // Build filter
    const filter = {
      'participants.user': req.user.userId,
      'participants.isActive': true
    };

    if (type !== 'all') {
      filter.type = type;
    }

    // Handle archived conversations
    if (archived === 'true') {
      filter['archivedBy.user'] = req.user.userId;
    } else {
      filter['archivedBy.user'] = { $ne: req.user.userId };
    }

    const conversations = await Conversation.find(filter)
      .populate('participants.user', 'firstName lastName avatar business')
      .populate('lastMessage')
      .populate('relatedProduct', 'name images price')
      .sort({ lastActivity: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Conversation.countDocuments(filter);

    res.json({
      success: true,
      data: {
        conversations,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching conversations',
      error: error.message
    });
  }
});

// Get or create conversation
router.post('/conversations', auth, async (req, res) => {
  try {
    const { participantId, productId } = req.body;

    if (!participantId) {
      return res.status(400).json({
        success: false,
        message: 'Participant ID is required'
      });
    }

    const conversation = await Conversation.findOrCreateDirectConversation(
      req.user.userId,
      participantId,
      productId
    );

    const populatedConversation = await Conversation.findById(conversation._id)
      .populate('participants.user', 'firstName lastName avatar business')
      .populate('relatedProduct', 'name images price');

    res.json({
      success: true,
      data: { conversation: populatedConversation }
    });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating conversation',
      error: error.message
    });
  }
});

// Get messages in a conversation
router.get('/conversations/:conversationId/messages', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      before // For pagination from a specific message
    } = req.query;

    const skip = (page - 1) * limit;

    // Verify user is participant in conversation
    const conversation = await Conversation.findOne({
      _id: req.params.conversationId,
      'participants.user': req.user.userId,
      'participants.isActive': true
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found or access denied'
      });
    }

    // Build filter
    const filter = {
      conversation: req.params.conversationId,
      isDeleted: false
    };

    if (before) {
      filter.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(filter)
      .populate('sender', 'firstName lastName avatar')
      .populate('recipient', 'firstName lastName avatar')
      .populate('metadata.relatedProduct', 'name images price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Message.countDocuments({
      conversation: req.params.conversationId,
      isDeleted: false
    });

    // Mark messages as read
    await Message.updateMany(
      {
        conversation: req.params.conversationId,
        recipient: req.user.userId,
        status: { $ne: 'read' }
      },
      {
        status: 'read',
        readAt: new Date()
      }
    );

    // Update conversation unread count
    await conversation.markAllAsRead(req.user.userId);

    res.json({
      success: true,
      data: {
        messages: messages.reverse(), // Return in chronological order
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message
    });
  }
});

// Send a message
router.post('/conversations/:conversationId/messages', auth, validateMessage, handleValidationErrors, async (req, res) => {
  try {
    const { content, type = 'text', metadata = {} } = req.body;

    // Verify user is participant in conversation
    const conversation = await Conversation.findOne({
      _id: req.params.conversationId,
      'participants.user': req.user.userId,
      'participants.isActive': true
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found or access denied'
      });
    }

    // Find recipient (other participant)
    const participant = conversation.participants.find(
      p => p.user.toString() !== req.user.userId && p.isActive
    );

    if (!participant) {
      return res.status(400).json({
        success: false,
        message: 'No active recipient found'
      });
    }

    const message = new Message({
      conversation: req.params.conversationId,
      sender: req.user.userId,
      recipient: participant.user,
      content,
      type,
      metadata
    });

    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'firstName lastName avatar')
      .populate('recipient', 'firstName lastName avatar');

    // Emit real-time message via Socket.io
    const io = req.app.get('io');
    io.to(`user_${participant.user}`).emit('newMessage', {
      message: populatedMessage,
      conversationId: req.params.conversationId
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: { message: populatedMessage }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
});

// Edit a message
router.put('/messages/:messageId', auth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    const message = await Message.findOne({
      _id: req.params.messageId,
      sender: req.user.userId,
      isDeleted: false
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found or unauthorized'
      });
    }

    // Check if message is too old to edit (e.g., 15 minutes)
    const editTimeLimit = 15 * 60 * 1000; // 15 minutes
    if (Date.now() - message.createdAt.getTime() > editTimeLimit) {
      return res.status(400).json({
        success: false,
        message: 'Message is too old to edit'
      });
    }

    await message.editContent(content);

    const updatedMessage = await Message.findById(message._id)
      .populate('sender', 'firstName lastName avatar');

    // Emit update via Socket.io
    const io = req.app.get('io');
    io.to(`user_${message.recipient}`).emit('messageUpdated', {
      message: updatedMessage
    });

    res.json({
      success: true,
      message: 'Message updated successfully',
      data: { message: updatedMessage }
    });
  } catch (error) {
    console.error('Edit message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error editing message',
      error: error.message
    });
  }
});

// Delete a message
router.delete('/messages/:messageId', auth, async (req, res) => {
  try {
    const message = await Message.findOne({
      _id: req.params.messageId,
      sender: req.user.userId
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found or unauthorized'
      });
    }

    await message.softDelete();

    // Emit update via Socket.io
    const io = req.app.get('io');
    io.to(`user_${message.recipient}`).emit('messageDeleted', {
      messageId: req.params.messageId
    });

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting message',
      error: error.message
    });
  }
});

// Archive conversation
router.post('/conversations/:conversationId/archive', auth, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.conversationId,
      'participants.user': req.user.userId
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    await conversation.archiveForUser(req.user.userId);

    res.json({
      success: true,
      message: 'Conversation archived successfully'
    });
  } catch (error) {
    console.error('Archive conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error archiving conversation',
      error: error.message
    });
  }
});

// Unarchive conversation
router.post('/conversations/:conversationId/unarchive', auth, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.conversationId,
      'participants.user': req.user.userId
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    await conversation.unarchiveForUser(req.user.userId);

    res.json({
      success: true,
      message: 'Conversation unarchived successfully'
    });
  } catch (error) {
    console.error('Unarchive conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error unarchiving conversation',
      error: error.message
    });
  }
});

// Get unread message count
router.get('/unread-count', auth, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      'participants.user': req.user.userId,
      'participants.isActive': true
    });

    let totalUnread = 0;
    conversations.forEach(conversation => {
      const unreadCount = conversation.metadata.unreadCount.get(req.user.userId.toString()) || 0;
      totalUnread += unreadCount;
    });

    res.json({
      success: true,
      data: { unreadCount: totalUnread }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching unread count',
      error: error.message
    });
  }
});

// Add reaction to message
router.post('/messages/:messageId/reaction', auth, async (req, res) => {
  try {
    const { emoji } = req.body;

    if (!emoji) {
      return res.status(400).json({
        success: false,
        message: 'Emoji is required'
      });
    }

    const message = await Message.findById(req.params.messageId);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is participant in the conversation
    const conversation = await Conversation.findOne({
      _id: message.conversation,
      'participants.user': req.user.userId
    });

    if (!conversation) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to react to this message'
      });
    }

    await message.addReaction(req.user.userId, emoji);

    res.json({
      success: true,
      message: 'Reaction added successfully',
      data: { reactions: message.reactions }
    });
  } catch (error) {
    console.error('Add reaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding reaction',
      error: error.message
    });
  }
});

// Remove reaction from message
router.delete('/messages/:messageId/reaction', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    await message.removeReaction(req.user.userId);

    res.json({
      success: true,
      message: 'Reaction removed successfully',
      data: { reactions: message.reactions }
    });
  } catch (error) {
    console.error('Remove reaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing reaction',
      error: error.message
    });
  }
});

module.exports = router;
