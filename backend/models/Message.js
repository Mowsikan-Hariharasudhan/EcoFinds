const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.ObjectId,
    ref: 'Conversation',
    required: true
  },
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    text: {
      type: String,
      maxlength: 2000
    },
    images: [{
      url: String,
      publicId: String,
      caption: String
    }],
    attachments: [{
      name: String,
      url: String,
      size: Number,
      type: String
    }]
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file', 'system', 'offer', 'order_update'],
    default: 'text'
  },
  metadata: {
    relatedProduct: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product'
    },
    relatedOrder: {
      type: mongoose.Schema.ObjectId,
      ref: 'Order'
    },
    offer: {
      amount: Number,
      currency: {
        type: String,
        default: 'USD'
      },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'declined', 'expired'],
        default: 'pending'
      },
      expiresAt: Date
    },
    systemMessage: {
      action: String,
      data: mongoose.Schema.Types.Mixed
    }
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'failed'],
    default: 'sent'
  },
  readAt: Date,
  deliveredAt: Date,
  isEdited: {
    type: Boolean,
    default: false
  },
  editHistory: [{
    content: String,
    editedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  reactions: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    emoji: String,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Conversation schema for organizing messages
const conversationSchema = new mongoose.Schema({
  participants: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    leftAt: Date,
    isActive: {
      type: Boolean,
      default: true
    },
    lastReadAt: Date,
    notificationsEnabled: {
      type: Boolean,
      default: true
    }
  }],
  type: {
    type: String,
    enum: ['direct', 'group', 'support'],
    default: 'direct'
  },
  subject: String,
  relatedProduct: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  },
  relatedOrder: {
    type: mongoose.Schema.ObjectId,
    ref: 'Order'
  },
  lastMessage: {
    type: mongoose.Schema.ObjectId,
    ref: 'Message'
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  archivedBy: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    archivedAt: {
      type: Date,
      default: Date.now
    }
  }],
  metadata: {
    messageCount: {
      type: Number,
      default: 0
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: {}
    },
    tags: [String],
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for messages
messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, status: 1 });

// Indexes for conversations
conversationSchema.index({ 'participants.user': 1, lastActivity: -1 });
conversationSchema.index({ relatedProduct: 1 });
conversationSchema.index({ relatedOrder: 1 });

// Pre-save middleware for messages
messageSchema.pre('save', function(next) {
  if (this.isNew) {
    this.deliveredAt = new Date();
  }
  next();
});

// Post-save middleware to update conversation
messageSchema.post('save', async function(doc) {
  const Conversation = mongoose.model('Conversation');
  
  await Conversation.findByIdAndUpdate(doc.conversation, {
    lastMessage: doc._id,
    lastActivity: doc.createdAt,
    $inc: { 'metadata.messageCount': 1 }
  });
  
  // Update unread counts
  const conversation = await Conversation.findById(doc.conversation);
  if (conversation) {
    conversation.participants.forEach(participant => {
      if (participant.user.toString() !== doc.sender.toString()) {
        const currentUnread = conversation.metadata.unreadCount.get(participant.user.toString()) || 0;
        conversation.metadata.unreadCount.set(participant.user.toString(), currentUnread + 1);
      }
    });
    await conversation.save();
  }
});

// Message methods
messageSchema.methods.markAsRead = async function(userId) {
  if (this.recipient.toString() === userId.toString() && this.status !== 'read') {
    this.status = 'read';
    this.readAt = new Date();
    
    // Update conversation unread count
    const Conversation = mongoose.model('Conversation');
    const conversation = await Conversation.findById(this.conversation);
    if (conversation) {
      const currentUnread = conversation.metadata.unreadCount.get(userId.toString()) || 0;
      if (currentUnread > 0) {
        conversation.metadata.unreadCount.set(userId.toString(), currentUnread - 1);
        await conversation.save();
      }
    }
    
    return this.save();
  }
  return this;
};

messageSchema.methods.editContent = function(newContent) {
  if (!this.isDeleted) {
    this.editHistory.push({
      content: this.content.text
    });
    this.content.text = newContent;
    this.isEdited = true;
    return this.save();
  }
  throw new Error('Cannot edit deleted message');
};

messageSchema.methods.softDelete = function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.content.text = 'This message has been deleted';
  return this.save();
};

messageSchema.methods.addReaction = function(userId, emoji) {
  const existingReaction = this.reactions.find(
    reaction => reaction.user.toString() === userId.toString()
  );
  
  if (existingReaction) {
    existingReaction.emoji = emoji;
  } else {
    this.reactions.push({ user: userId, emoji });
  }
  
  return this.save();
};

messageSchema.methods.removeReaction = function(userId) {
  this.reactions = this.reactions.filter(
    reaction => reaction.user.toString() !== userId.toString()
  );
  return this.save();
};

// Conversation methods
conversationSchema.methods.addParticipant = function(userId) {
  const exists = this.participants.some(
    p => p.user.toString() === userId.toString() && p.isActive
  );
  
  if (!exists) {
    this.participants.push({ user: userId });
    this.metadata.unreadCount.set(userId.toString(), 0);
    return this.save();
  }
  
  return this;
};

conversationSchema.methods.removeParticipant = function(userId) {
  const participant = this.participants.find(
    p => p.user.toString() === userId.toString()
  );
  
  if (participant) {
    participant.isActive = false;
    participant.leftAt = new Date();
    this.metadata.unreadCount.delete(userId.toString());
    return this.save();
  }
  
  return this;
};

conversationSchema.methods.markAllAsRead = function(userId) {
  this.metadata.unreadCount.set(userId.toString(), 0);
  
  const participant = this.participants.find(
    p => p.user.toString() === userId.toString()
  );
  
  if (participant) {
    participant.lastReadAt = new Date();
  }
  
  return this.save();
};

conversationSchema.methods.archiveForUser = function(userId) {
  const existingArchive = this.archivedBy.find(
    archive => archive.user.toString() === userId.toString()
  );
  
  if (!existingArchive) {
    this.archivedBy.push({ user: userId });
    return this.save();
  }
  
  return this;
};

conversationSchema.methods.unarchiveForUser = function(userId) {
  this.archivedBy = this.archivedBy.filter(
    archive => archive.user.toString() !== userId.toString()
  );
  return this.save();
};

// Virtual for message age
messageSchema.virtual('ageInMinutes').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60));
});

// Virtual for conversation unread count for specific user
conversationSchema.virtual('getUnreadCount').get(function() {
  return function(userId) {
    return this.metadata.unreadCount.get(userId.toString()) || 0;
  };
});

// Static method to find or create conversation
conversationSchema.statics.findOrCreateDirectConversation = async function(user1Id, user2Id, productId = null) {
  // Look for existing conversation between these users
  let conversation = await this.findOne({
    type: 'direct',
    'participants.user': { $all: [user1Id, user2Id] },
    'participants.isActive': true,
    ...(productId && { relatedProduct: productId })
  });
  
  if (!conversation) {
    conversation = new this({
      type: 'direct',
      participants: [
        { user: user1Id },
        { user: user2Id }
      ],
      ...(productId && { relatedProduct: productId })
    });
    
    conversation.metadata.unreadCount.set(user1Id.toString(), 0);
    conversation.metadata.unreadCount.set(user2Id.toString(), 0);
    
    await conversation.save();
  }
  
  return conversation;
};

const Message = mongoose.model('Message', messageSchema);
const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = { Message, Conversation };
