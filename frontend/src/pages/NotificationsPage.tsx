import { 
  Card, 
  Button, 
  Badge,
  Spinner
} from "flowbite-react";
import { 
  Check, 
  Trash2, 
  Package, 
  MessageCircle, 
  Info,
  CheckCircle
} from "lucide-react";
import { useNotificationsQuery } from "../hooks/queries";
import { useNotificationStore, type INotification } from "../store/notificationStore";
import { useDeleteNotificationMutation, useMarkAllNotificationsAsReadMutation, useMarkNotificationAsReadMutation } from "../hooks/mutations";

export function NotificationsPage() {
  const { data, isPending } = useNotificationsQuery()
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const { mutate: markAsRead, isPending: markAsReadPending  } = useMarkNotificationAsReadMutation()
  const {  mutate: markAllAsRead, isPending: markAllAsReadPending } = useMarkAllNotificationsAsReadMutation()
  const { mutate: deleteNotification, isPending: deleteNotificationPending } = useDeleteNotificationMutation()

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "ORDER":
        return <Package className="w-5 h-5 text-blue-500" />;
      case "MESSAGE":
        return <MessageCircle className="w-5 h-5 text-green-500" />;
      case "SYSTEM":
        return <Info className="w-5 h-5 text-yellow-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "ORDER":
        return "blue";
      case "MESSAGE":
        return "green";
      case "SYSTEM":
        return "yellow";
      default:
        return "gray";
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  const notifications = data.notifications

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            {data.unreadCount > 0 ? `${data.unreadCount} unread notification${data.unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            onClick={() => markAllAsRead()}
            disabled={markAllAsReadPending}
            color="light"
            size="sm"
          >
            <Check className="w-4 h-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      {notifications?.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <CheckCircle className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-500">You're all caught up! No new notifications to show.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications?.map((notification: INotification) => (
            <Card 
              key={notification._id}
              className={`transition-all duration-200 ${
                !notification.isRead 
                  ? 'bg-blue-50 border-blue-200 shadow-sm' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge color={getTypeColor(notification.type)} size="sm">
                          {notification.type}
                        </Badge>
                        {!notification.isRead && (
                          <Badge color="blue" size="sm">New</Badge>
                        )}
                      </div>
                      
                      <p className={`text-gray-900 mb-2 ${
                        !notification.isRead ? 'font-semibold' : 'font-normal'
                      }`}>
                        {notification.content}
                      </p>
                      
                      <p className="text-sm text-gray-500">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {!notification.isRead && (
                        <Button
                          onClick={() => markAsRead(notification._id)}
                          disabled={markAsReadPending}
                          color="light"
                          size="xs"
                          title="Mark as read"
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                      )}
                      <Button
                        onClick={() => deleteNotification(notification._id)}
                        disabled={deleteNotificationPending}
                        color="light"
                        size="xs"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
