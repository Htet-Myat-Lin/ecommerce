import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import morgan from "morgan"

import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import productRouter from "./routes/product.route.js"
import categoryRouter from "./routes/category.route.js"
import orderRouter from "./routes/order.route.js"
import paymentRouter from "./routes/payment.route.js"
import dashboardRouter from "./routes/dashboard.route.js"
import notificationRouter from "./routes/notification.route.js"
import reviewRouter from "./routes/review.route.js"
import wishlistRouter from "./routes/wishlist.route.js"
import { errorHandler } from "./middleware/error.handler.js"

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use("/uploads", express.static("src/uploads"))

app.use(cors({
    origin: "http://localhost:5000",
    credentials: true
}))

app.use(morgan("short"))

app.use("/api/auth", authRouter)
app.use("/api/users", userRouter)
app.use("/api/products", productRouter)
app.use("/api/categories", categoryRouter)
app.use("/api/orders", orderRouter)
app.use("/api/payments", paymentRouter)
app.use("/api/admin/dashboard", dashboardRouter)
app.use("/api/notifications", notificationRouter)
app.use("/api/reviews", reviewRouter)
app.use("/api/wishlist", wishlistRouter)

// Global Error Handler
app.use(errorHandler)

export default app