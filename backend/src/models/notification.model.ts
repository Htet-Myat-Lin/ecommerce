import { model, Schema } from "mongoose"
import type { INotification } from "../utils/types.js"

const notificationSchema = new Schema<INotification>({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    type: { 
        type: String, 
        enum: ["MESSAGE", "ORDER", "SYSTEM"], 
        required: true 
    },
    content: { 
        type: String, 
        required: true 
    },
    isRead: { 
        type: Boolean, 
        default: false 
    }
},{
    timestamps: true
})

export const NotificationModel = model<INotification>("Notification", notificationSchema)