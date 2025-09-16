import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    // The participants in the conversation (e.g., two users for a private chat)
    participants: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      required: true,
      validate: {
        validator: function (v) {
          // A conversation must have at least 2 participants
          return v.length >= 2;
        },
        message: 'A conversation must have at least 2 participants.',
      },
    },
    
    // The messages in the conversation, stored as an array of references
    messages: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
      default: [],
    },
    
    // Type of conversation: private or group
    type: {
      type: String,
      enum: ['private', 'group'],
      required: true,
    },
    
    // Fields for group chats
    name: {
      type: String,
      required: function () {
        return this.type === 'group';
      },
      trim: true,
      minlength: 3,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: function () {
        return this.type === 'group';
      },
    },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt fields
  }
);

export const Conversation = mongoose.model('Conversation', conversationSchema);