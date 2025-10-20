import mongoose from "mongoose";

const sportSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true 
        },
    description: { 
        type: String, 
        required: true 
    },
    icon: { 
        type: String,
         required: false 
        },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    players: { 
        type: Number, 
        required: true 
    },
    selectedSports: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Sport', 
        required: false 
    },
    onboardingCompleted: { 
        type: Boolean, 
        default: false 
    },
    category: { 
        type: String, 
        required: true, 
        enum: ['team', 'individual', 'dual']
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },

}, { timestamps: true 


});

sportSchema.index({ name: 1, category: 1 }, { unique: true });
sportSchema.index({ isActive: 1 });

export default mongoose.model("Sport", sportSchema);
