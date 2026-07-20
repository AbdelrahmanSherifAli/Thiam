/**
 * إعدادات الربط السحابي وتخزين الصور للمتجر
 * Cloud Sync & Image Upload Configuration
 */
export const CLOUD_CONFIG = {
  // رابط قاعدة بيانات فايربيس (Firebase Realtime Database REST API URL)
  // يرجى إنشاء قاعدة بيانات مجانية على Firebase وتفعيل القراءة والكتابة، ثم وضع الرابط هنا.
  // مثال: "https://my-store-12345-default-rtdb.firebaseio.com"
  databaseUrl: "https://thiam-da6cc-default-rtdb.firebaseio.com",

  // مفتاح API لخدمة رفع الصور ImgBB (ImgBB API Key)
  // يمكنك الحصول عليه مجاناً وبسرعة من: https://api.imgbb.com/
  // عند وضعه، سيتم رفع أي صورة لمنتج أو شعار تلقائياً إلى السحابة والحصول على رابط مباشر لها.
  imgbbApiKey: "b3855bb4a2621543622819237acd2176"
};

/**
 * بيانات تسجيل الدخول للوحة التحكم
 * Admin Dashboard Login Credentials
 */
export const ADMIN_CREDENTIALS = {
  email: "thiamshop1230@gmail.com",
  password: "thiam12345678"
};
