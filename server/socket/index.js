import express from 'express'
import dotenv from 'dotenv'
import {Server} from 'socket.io'
import http from 'http'
import getUserDetailsFromToken from '../utils/getUserDetailsFromToken.js'
import User from '../models/User.js'
import Conversation from '../models/Conversation.js'
import Message from '../models/Message.js'
import { getConversation } from '../controllers/chat.js'
dotenv.config()

import {allowedOrigins} from '../utils/urls.js'


const app = express()




import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';


const resources = {
    en: {
        translation: {
    "admin": {
        "no_unapproved": "No unapproved users found",
        "unapproved_found": "Unapproved users retrieved successfully",
        "user_not_found": "User not found",
        "upproved_sucessfully": "User approved successfully",
        "disapproved_successfully": "User disapproved successfully"
    },

    "appointment": {
        "doctor_not_found": "Doctor not found",
        "no_fee": "Appointment fee not configured",
        "no_patient": "The patient dosen't exist",
        "no_doctor": "The doctor dosen't exist",
        "doctors_only": "You can only book appointments with doctors",
        
        "no_appointment_in_past": "Can't book appointment in the past",
        "doctor_not_free": "This doctor isn't free at this time",
        
        "appointment_with_doctor": "Appointment with Dr. ",
        "appointment_time": "30-minute appointment on ",
        
        
        "session_id_required": "Session ID is required",
        
        "payment_not_completed": "Payment not completed",
        "unothorzed": "Unauthorized",
        "payment_not_found": "Payment record not found",
        
        "payment_processed": "Payment already processed",
        "sucess_appointment": "Patient appointments retrieved successfully",
        "doctor_app_fetched": "Doctor appointments fetched successfully",
        
        "invalid_id": "Invalid appointment ID",
        "not_found": "Appointment not found",
        "unaothorized": "Unauthorized to update status",
        




        "cant_modify": "Cannot modify a cancelled or completed appointment",
        
        
        "status_updated": "Appointment status updated successfully",
        "unaothorized_cancel": "Unauthorized to cancel",
        

        
        "cant_cancel_past": "Cannot cancel past appointments",
        

        "already_cancelled": "Appointment is already cancelled",
        "patient_only": "Patients can'y cancel completed appoinment",
        "cancelled_successfully": "Appointment cancelled successfully",
        
        "no_doctors": "there is no doctors right now",
        "doctors_found": "doctors founded successfully"
    },

    "auth": {
        "email_send_failed": "Email send failed",
        "email_exists": "Email already exists.",
        "email_sent": "Verification email sent. Please verify your email",
        "username_exists": "Username already exists.",

        "no_user_with_this_email": "There is no user with this email address",

        "incorrect_confirmation_code": "Incorrect confirmation code, please try again",
        "code_not_valid": "This code not valid any more please try another one",
        "verified_successfully": "Your email has been verified successfully ",


        
        "user_not_found": "User not found",
        "user_not_verified": "User not verified",
        "invalid_email_password": "Invalid email or password",
        "logged_in_successfully": "Logged in successfully",

        "email_not_exists": "Something wrong with this email maybe it does not exist",

        "confirmation_email_not_exist": "Something wrong with this email maybe it does not exist",
        "reset_password_sent": "reset password message sent to your email successfully",

        "invalid_token": "Invalid or expired token",
        "code_verified": "Code verified, you can reset password",
        "password_reset_successfully": "Password has been reset successfully",

        "user_logged_out": "User has been logged out!"

    },

    "book": {


    "payment_intent_created": "Payment intent created successfully",
    "checkout_session_created": "Checkout session created successfully",
    "session_or_intent_required": "Session ID or Payment Intent ID is required",
    "payment_not_completed": "Payment has not been completed",
    "unauthorized": "Unauthorized access",
    "payment_verified": "Payment verified successfully",

        "pdf_required": "PDF file is required",
        "image_required": "Image file is required",
        "book_created": "Book created successfully",
        
        "no_book": "Book not found",
        "sesstion_id_required": "Session ID is required",
        "payment_not_completetd": "Payment not completed",
        
        "unaothorized": "Unauthorized",
        "no_access": "You do not have access to this book",
        "book_pdf_not_found": "Book or PDF not found",
        


        "pdf_not_found": "PDF file not found",
        "book_not_found": "Book file not found",



        "no_file": "No files uploaded",
        "images_uploaded": "Images uploaded successfully",
        "delete_own_listing_only": "You can only delete your own listings Only!",
        
        "upproved_first_to_delete": "You need to be approved first to delete books you haven't created!",
        "book_deleted": "book deleted successfully",
        
        
        "update_own_listing": "You can only update your own listings!",

        "upproved_first_to_update": "You need to be approved first to update books you haven't created!",
        "book_updated": "book updated successfully",
        "book_found": "book founded successfully",

        "book_recieved": "books recieved successfully"

        },

    "chatbot": {
        "unexpected_format": "unexpected Chat History Id",
        "required_message": "message is required",
        "required_user_id": "user id is required",
        "user_not_found": "User not found",
        "history_not_exists": "Chat history dosn't exists",


        "streaming_error": "Error during streaming ",
        "processing_failed": "Chat processing failed",



        "history_founded": "Chat history founded successfully",
        "chat_messages_failed": "Failed to fetch chat messages"

    },

    "comment": {
        "not_allowd_to_create": "You are not allowed to create this comment",
        "created": "comment created successfully",
        
        "all_comments": "all comments on this post",
        "not_found": "Comment not found",
        "liked_successfully": "the comment has been liked successfully",
        
        "not_allowd_to_edit": "You are not allowed to edit this comment",
        "upproved_first_to_edit": "You need to be approved first to edit comments you haven't created!",
        "upproved_first_to_delete": "You need to be approved first to delete comments you haven't created!",
        
        "edited": "the comment edit successfully",
        "not_allowd_to_delete": "You are not allowed to delete this comment",
        "deleted": "the comment deleted successfully",
        
        "not_allowd_to_get_all": "You are not allowed to get all comments",
        "upproved_first_to_get_all": "You need to be approved first to get all comments",
        "all": "All comments"

    },

    "stripe": {
        "book_not_found": "Book not found",
        "checkout_created": "Checkout session created successfully",
        "payment_not_completed": "Payment not completed"
    },

    "user": {
        "only_update_own_account": "You can only update your own account",
        "not_found": "User not found",
        
        "updated": "user updated successfully",
        "only_delete_own_account": "You can only delete your own account",
        "upproved_first_to_delete": "You need to be approved first to delete users",
        
        "message": "User has been deleted",
        "founded": "User founded successfully",
        "not_allowd_to_get_all": "You are not allowed to see all users",

        "upproved_first_to_get_all": "You need to be approved first to get all users",
        "all_users": "All users"
    },

    "multer": {
        "only_image_pdf": "Only images and PDFs are allowed!",
        "unsupported": "Unsupported file format. Only JPEG, JPG, PNG, GIF, and PDF are allowed."

    },

    "middleware": {
        "user_not_found": "User not found",
        "not_admin": "You are not admin to perform this action",
        "not_approved_admin": "You are not allow to perform this action till an andmin prove your identity",
        "not_doctor": "You are not a doctor to perform this action",
        "not_approved_doctor": "You are not allow to perform this action as a doctor till an andmin prove your identity",
        "error": "Server Error",
        "not_admin_doctor": "You aren't admin or doctor to perform this action",
        "not_approved_admin_doctor": "You aren't approved admin or approved doctor to perform this action"
    },

    "server": {
        "not_available": "resource not availble"
    }




    
},


    },

        ar: {
        translation: {
  "admin": {
    "no_unapproved": "لا يوجد مستخدمون غير معتمدين",
    "unapproved_found": "تم استرجاع المستخدمين غير المعتمدين بنجاح",
    "user_not_found": "المستخدم غير موجود",
    "upproved_sucessfully": "تمت الموافقة على المستخدم بنجاح",
    "disapproved_successfully": "تم رفض المستخدم بنجاح"
  },
  
  "appointment": {
    "doctor_not_found": "الطبيب غير موجود",
    "no_fee": "لم يتم تحديد رسوم الموعد",
    "no_patient": "المريض غير موجود لدينا",
    "no_doctor": "الطبيبب غير موجود لدينا",
    "doctors_only": "يمكنك حجز مواعيد مع الأطباء فقط",
    "no_appointment_in_past": "لا يمكن حجز موعد في الماضي",
    "doctor_not_free": "الطبيب غير متاح في هذا الوقت",
    "appointment_with_doctor": "موعد مع الدكتور ",
    "appointment_time": "موعد لمدة 30 دقيقة في ",
    "session_id_required": "مطلوب رقم الجلسة",
    "payment_not_completed": "لم يتم إتمام الدفع",
    "unothorzed": "غير مصرح",
    "payment_not_found": "سجل الدفع غير موجود",
    "payment_processed": "تمت معالجة الدفع مسبقًا",
    "sucess_appointment": "تم استرجاع مواعيد المريض بنجاح",
    "doctor_app_fetched": "تم استرجاع مواعيد الطبيب بنجاح",
    "invalid_id": "رقم الموعد غير صالح",
    "not_found": "الموعد غير موجود",
    "unaothorized": "غير مصرح لك بتحديث الحالة",
    "cant_modify": "لا يمكن تعديل موعد تم إلغاؤه أو إتمامه",
    "status_updated": "تم تحديث حالة الموعد بنجاح",
    "unaothorized_cancel": "غير مصرح لك بالإلغاء",
    "cant_cancel_past": "لا يمكن إلغاء المواعيد السابقة",
    "already_cancelled": "تم إلغاء الموعد مسبقًا",
    "patient_only": "يمكن للمرضى فقط إلغاء المواعيد المكتمله",
    "cancelled_successfully": "تم إلغاء الموعد بنجاح",
    "no_doctors": "لا يوجد أطباء الآن",
    "doctors_found": "تم العثور على الأطباء بنجاح"
  },

  "auth": {
    "email_send_failed": "فشل في إرسال البريد الإلكتروني",
    "email_exists": "البريد الإلكتروني مستخدم بالفعل.",
    "email_sent": "تم إرسال بريد التحقق، يرجى التحقق من بريدك الإلكتروني",
    "username_exists": "اسم المستخدم مستخدم بالفعل.",
    "no_user_with_this_email": "لا يوجد مستخدم بهذا البريد الإلكتروني",
    "incorrect_confirmation_code": "رمز التأكيد غير صحيح، يرجى المحاولة مرة أخرى",
    "code_not_valid": "هذا الرمز لم يعد صالحًا، يرجى المحاولة برمز آخر",
    "verified_successfully": "تم التحقق من بريدك الإلكتروني بنجاح",
    "user_not_found": "المستخدم غير موجود",
    "user_not_verified": "المستخدم لم يتم التحقق منه",
    "invalid_email_password": "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    "logged_in_successfully": "تم تسجيل الدخول بنجاح",
    "email_not_exists": "يوجد خطأ في هذا البريد الإلكتروني، ربما غير موجود",
    "confirmation_email_not_exist": "يوجد خطأ في هذا البريد الإلكتروني، ربما غير موجود",
    "reset_password_sent": "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني بنجاح",
    "invalid_token": "رمز غير صالح أو منتهي الصلاحية",
    "code_verified": "تم التحقق من الرمز، يمكنك الآن إعادة تعيين كلمة المرور",
    "password_reset_successfully": "تمت إعادة تعيين كلمة المرور بنجاح",
    "user_logged_out": "تم تسجيل خروج المستخدم!"
  },

    "book": {


    "payment_intent_created": "تم إنشاء نية الدفع بنجاح",
    "checkout_session_created": "تم إنشاء جلسة الدفع بنجاح",
    "session_or_intent_required": "معرف الجلسة أو معرف نية الدفع مطلوب",
    "payment_not_completed": "لم يتم إكمال الدفع",
    "unauthorized": "الوصول غير مصرح به",
    "payment_verified": "تم التحقق من الدفع بنجاح",

    "pdf_required": "ملف PDF مطلوب",
    "image_required": "صورة مطلوبة",
    "book_created": "تم إنشاء الكتاب بنجاح",
    "no_book": "الكتاب غير موجود",
    "sesstion_id_required": "رقم الجلسة مطلوب",
    "payment_not_completetd": "لم يتم إكمال الدفع",
    "unaothorized": "غير مصرح",
    "no_access": "ليس لديك صلاحية للوصول إلى هذا الكتاب",
    "book_pdf_not_found": "الكتاب أو ملف PDF غير موجود",
    "pdf_not_found": "ملف PDF غير موجود",
    "book_not_found": "ملف الكتاب غير موجود",
    "no_file": "لم يتم رفع أي ملفات",
    "images_uploaded": "تم رفع الصور بنجاح",
    "delete_own_listing_only": "يمكنك حذف منشوراتك فقط!",
    "upproved_first_to_delete": "تحتاج للموافقة أولاً لحذف كتب لم تقم بإنشائها!",
    "book_deleted": "تم حذف الكتاب بنجاح",
    "update_own_listing": "يمكنك تعديل منشوراتك فقط!",
    "upproved_first_to_update": "تحتاج للموافقة أولاً لتعديل كتب لم تقم بإنشائها!",
    "book_updated": "تم تعديل الكتاب بنجاح",
    "book_found": "تم العثور على الكتاب بنجاح",
    "book_recieved": "تم استلام الكتب بنجاح"
  },

  "chatbot": {
    "unexpected_format": "معرف المحادثه غير مقبول",
    "required_message": "الرسالة مطلوبة",
    "required_user_id": "معرّف المستخدم مطلوب",
    "user_not_found": "المستخدم غير موجود",
    "history_not_exists": "لا يوجد سجل محادثة",
    "streaming_error": "حدث خطأ أثناء البث",
    "processing_failed": "فشل في معالجة المحادثة",
    "history_founded": "تم العثور على سجل المحادثة بنجاح",
    "chat_messages_failed": "فشل في جلب رسائل المحادثة"
  },

  "comment": {
    "not_allowd_to_create": "غير مسموح لك بإنشاء هذا التعليق",
    "created": "تم إنشاء التعليق بنجاح",
    "all_comments": "كل التعليقات على هذا المنشور",
    "not_found": "التعليق غير موجود",
    "liked_successfully": "تم الإعجاب بالتعليق بنجاح",
    "not_allowd_to_edit": "غير مسموح لك بتعديل هذا التعليق",
    "upproved_first_to_edit": "يجب الموافقة عليك أولاً لتعديل تعليقات لم تقم بإنشائها!",
    "upproved_first_to_delete": "يجب الموافقة عليك أولاً لحذف تعليقات لم تقم بإنشائها!",
    "edited": "تم تعديل التعليق بنجاح",
    "not_allowd_to_delete": "غير مسموح لك بحذف هذا التعليق",
    "deleted": "تم حذف التعليق بنجاح",
    "not_allowd_to_get_all": "غير مسموح لك بعرض جميع التعليقات",
    "upproved_first_to_get_all": "يجب الموافقة عليك أولاً لعرض جميع التعليقات",
    "all": "جميع التعليقات"
  },

  "stripe": {
    "book_not_found": "الكتاب غير موجود",
    "checkout_created": "تم إنشاء جلسة الدفع بنجاح",
    "payment_not_completed": "لم يتم إكمال عملية الدفع"
  },

  "user": {
    "only_update_own_account": "يمكنك تعديل حسابك فقط",
    "not_found": "المستخدم غير موجود",
    "updated": "تم تحديث المستخدم بنجاح",
    "only_delete_own_account": "يمكنك حذف حسابك فقط",
    "upproved_first_to_delete": "يجب الموافقة عليك أولاً لحذف المستخدمين",
    "message": "تم حذف المستخدم",
    "founded": "تم العثور على المستخدم بنجاح",
    "not_allowd_to_get_all": "غير مسموح لك بعرض جميع المستخدمين",
    "upproved_first_to_get_all": "يجب الموافقة عليك أولاً لعرض جميع المستخدمين",
    "all_users": "جميع المستخدمين"
  },

  "multer": {
    "only_image_pdf": "مسموح فقط برفع الصور وملفات PDF!",
    "unsupported": "صيغة الملف غير مدعومة. يُسمح فقط بـ JPEG, JPG, PNG, GIF, وPDF."
  },

  "middleware": {
    "user_not_found": "المستخدم غير موجود",
    "not_admin": "أنت لست مشرفًا لتنفيذ هذا الإجراء",
    "not_approved_admin": "لا يُسمح لك بتنفيذ هذا الإجراء حتى يتم تأكيد هويتك كمشرف",
    "not_doctor": "أنت لست طبيبًا لتنفيذ هذا الإجراء",
    "not_approved_doctor": "لا يُسمح لك بتنفيذ هذا الإجراء كطبيب حتى يتم تأكيد هويتك",
    "error": "خطأ في الخادم",
    "not_admin_doctor": "انت لست مدير او طبيب ل تنفيذ هذا الاجراء",
    "not_approved_admin_doctor": "انت لست مدير او طبيب معتمد ل تنفيذ هذا الاجراء"
  },

  "server": {
    "not_available": "المورد غير متاح"
  }
}


    },
};


i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    preload: ['en', 'ar'],            // languages to load
    detection: {
      // order & keys to lookup language from
      order: ['querystring', 'header', 'cookie'],
      lookupQuerystring: 'lng',
      caches: []

    },
    resources,
  });


// translate


app.use(middleware.handle(i18next));



/***socket connection */
const server = http.createServer(app)
// console.log(process.env.FRONTEND_URL)
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST", "DELETE", "PUT", 'PATCH'],
        credentials: true
    }
})


// online user
const onlineUser = new Set()

io.on('connection', async (socket) => {
    console.log("connect User ", socket.id)

    const token = socket.handshake.auth.token

    // current user details 
    let user
    try {
        user = await getUserDetailsFromToken(token)
    } catch (error) {
        console.error('Failed to get user details from token:', error)
        socket.disconnect(true)
        return
    }

    if (!user || !user._id) {
        console.error('Invalid user details:', user)
        socket.disconnect(true)
        return
    }

    // create a room
    socket.join(user._id.toString())
    onlineUser.add(user._id.toString())

    io.emit('onlineUser', Array.from(onlineUser))

    socket.on('message-page', async (userId) => {
        // console.log('userId', userId)
        try {
            const userDetails = await User.findById(userId).select("-password")
            // console.log(userDetails)
            const payload = {
                _id: userDetails?._id,
                username: userDetails?.username,
                email: userDetails?.email,
                avatar: userDetails?.avatar,
                isDoctor: userDetails?.isDoctor,
                online: onlineUser.has(userId)
            }
            socket.emit('message-user', payload)

            // get previous message
            const getConversationMessage = await Conversation.findOne({
                "$or": [
                    { sender: user._id, receiver: userId },
                    { sender: userId, receiver: user._id }
                ]
            }).populate('messages').sort({ updatedAt: -1 })

            socket.emit('message', getConversationMessage?.messages || [])
        } catch (error) {
            console.error('Error in message-page event:', error)
        }
    })

    // new message
    socket.on('new message', async (data) => {
        try {
            // check conversation is available both user
            let conversation = await Conversation.findOne({
                "$or": [
                    { sender: data?.sender, receiver: data?.receiver },
                    { sender: data?.receiver, receiver: data?.sender }
                ]
            })

            // if conversation is not available
            if (!conversation) {
                const createConversation = new Conversation({
                    sender: data?.sender,
                    receiver: data?.receiver
                })
                conversation = await createConversation.save()
            }

            const message = new Message({
                text: data?.text,
                imageUrl: data?.imageUrl,
                videoUrl: data?.videoUrl,
                msgByUserId: data?.msgByUserId,
            })
            const saveMessage = await message.save()

            await Conversation.updateOne({ _id: conversation?._id }, {
                "$push": { messages: saveMessage?._id }
            })

            const getConversationMessage = await Conversation.findOne({
                "$or": [
                    { sender: data?.sender, receiver: data?.receiver },
                    { sender: data?.receiver, receiver: data?.sender }
                ]
            }).populate('messages').sort({ updatedAt: -1 })

            io.to(data?.sender).emit('message', getConversationMessage?.messages || [])
            io.to(data?.receiver).emit('message', getConversationMessage?.messages || [])

            // send conversation
            const conversationSender = await getConversation(data?.sender)
            const conversationReceiver = await getConversation(data?.receiver)

            io.to(data?.sender).emit('conversation', conversationSender)
            io.to(data?.receiver).emit('conversation', conversationReceiver)
        } catch (error) {
            console.error('Error in new message event:', error)
        }
    })

    // sidebar
    socket.on('sidebar', async (currentUserId) => {
        // console.log("current user", currentUserId)
        try {
            const conversation = await getConversation(currentUserId)
            socket.emit('conversation', conversation)
        } catch (error) {
            console.error('Error in sidebar event:', error)
        }
    })

    socket.on('seen', async (msgByUserId) => {
        try {
            let conversation = await Conversation.findOne({
                "$or": [
                    { sender: user?._id, receiver: msgByUserId },
                    { sender: msgByUserId, receiver: user?._id }
                ]
            })

            const conversationMessageId = conversation?.messages || []

            await Message.updateMany(
                { _id: { "$in": conversationMessageId }, msgByUserId: msgByUserId },
                { "$set": { seen: true } }
            )

            // send conversation
            const conversationSender = await getConversation(user?._id?.toString())
            const conversationReceiver = await getConversation(msgByUserId)

            io.to(user?._id?.toString()).emit('conversation', conversationSender)
            io.to(msgByUserId).emit('conversation', conversationReceiver)
        } catch (error) {
            console.error('Error in seen event:', error)
        }
    })

    // disconnect
    socket.on('disconnect', () => {
        onlineUser.delete(user?._id?.toString())
        console.log('disconnect user ', socket.id)
    })
})

export {
    server,
    app
}