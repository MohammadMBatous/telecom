import { Telegraf, Markup } from "telegraf";
import { token } from "../config/config.js";
import Storage from "node-persist";
export const bot = new Telegraf(token);

(async () => {
  try {
    await Storage.init();
  } catch (error) {
    console.error("🔴 خطأ في التخزين، سيتم حذفه وإعادة إنشائه...");
    await Storage.clear();
    await Storage.init();
  }
})();

bot.start((ctx) =>

  ctx.reply(
    `أهلاً وسهلاً بك في البوت الخاص بـ اتصالات سوريا📱☎ \n من فضلك  يا ${ctx.from.first_name} اختر ماذا يمكنك مساعدتك من خلال شريط الأزرار في القائمة السفلى`,
    {
      reply_markup: {
        keyboard: [
          [
            { text: "معرفة الرصيد المتبقي" },
            { text: "الأسعار الخاصة بالخدمات" },
          ],
          [{ text: "إرسال إقتراح أو شكوى" }, { text: "أسئلة شائعة" }],
          [{text:"تواصل مع خدمة الزبائن"}],
        ],
        resize_keyboard: true,
      },
    }
  )
);
bot.hears("معرفة الرصيد المتبقي", async (ctx) => {

  ctx.reply(
    `من فضلك يا ${ctx.from.first_name} قم بإرسال اسم المستخدم وكلمة المرور الخاصة بحسابك في اتصالات سوريا \n 🔴 كل واحدة في رسالة منفصلة`
  );
  console.log(ctx.from.first_name);
  console.log(ctx.from.id);
  console.log(ctx.from.username);
  await Storage.setItem(`balance-${ctx.from.id}`, true);
  await Storage.setItem(`username-${ctx.from.id}`, false);
});

bot.hears("الأسعار الخاصة بالخدمات", async (ctx) => {
  const messageprice = await ctx.reply("جاري إرسال النشرة ..");
  await ctx.replyWithPhoto({ source: "./src/images/prices_image.jpg" });
  await ctx.telegram.editMessageText(
    ctx.chat.id,
    messageprice.message_id,
    undefined,
    "تم إرسال النشرة بنجاح ✅"
  );
});

bot.hears("أسئلة شائعة", (ctx) => {
    ctx.reply(`
1- كيف يمكنني معرفة الرصيد المتبقي؟ 💰
الإجابة: يمكنك معرفة الرصيد المتبقي من خلال الدخول إلى حسابك على التطبيق أو من خلال إرسال استفسار إلى الدعم الفني. 📱

2- كيف يمكنني شحن الرصيد؟ 🔋
الإجابة: يمكنك شحن الرصيد عبر شام كاش أو من خلال مراكز الخدمة المعتمدة. 💳

3- كيف يمكنني تغيير كلمة المرور؟ 🔑
الإجابة: لتغيير كلمة المرور، يمكنك الدخول إلى إعدادات حسابك واختيار "تغيير كلمة المرور"، ثم اتبع التعليمات. 🛠️

4- كيف يمكنني إلغاء الاشتراك في الخدمة؟ ❌
الإجابة: يمكنك إلغاء الاشتراك عبر الموقع الرسمي أو من خلال الاتصال بالدعم الفني. 📞

5- كيف يمكنني التواصل مع الدعم الفني؟ 🆘
الإجابة: يمكنك التواصل مع الدعم الفني عبر البريد الإلكتروني أو من خلال خدمة الدردشة المباشرة في التطبيق. 💬
 `);
        
});

bot.hears("إرسال إقتراح أو شكوى", async (ctx) => {
    ctx.reply(
        `من فضلك يا ${ctx.from.first_name} قم بإرسال اقتراحك أو شكواك في رسالة واحدة مع ذكر كافة التفاصيل وسوف نقوم بالرد عليك في أقرب وقت ممكن`
    );
    await Storage.setItem(`complaint-${ctx.from.id}`, true);
    
});

bot.hears("تواصل مع خدمة الزبائن", async (ctx) => {
ctx.reply(
    "اختر طريقة التواصل التي ترغب بها",    Markup.inlineKeyboard([
      [
        Markup.button.url(
          "🟢 واتساب",
          "https://api.whatsapp.com/send?phone=+12675754741"
        ),
        Markup.button.url(
          "🔵 تلغرام",
          "https://t.me/@CustomerServiceTele"
        ),
      ]
      ])
      
);


});
// hear any text
bot.on("message", async (ctx) => {
  const balance = await Storage.getItem(`balance-${ctx.from.id}`);
  const username = await Storage.getItem(`username-${ctx.from.id}`);
  const complaint = await Storage.getItem(`complaint-${ctx.from.id}`);
  if (balance) {
    if (!username) {
      await Storage.setItem(`username-${ctx.from.id}`, true);
      ctx.reply(
        `من فضلك يا ${ctx.from.first_name} قم بإرسال كلمة المرور الخاصة بحسابك في اتصالات سوريا`
      );
    } else {
      const message = `شكراً لك لإرسال بيانات حسابك\n
    بيانات الحساب الخاصة بك هي : \n
    <b> 👤  اسم المشترك:</b> محمد محمد \n
    <b> 📞  رقم الحساب:</b> 222222@idlib.com \n
    <b> 💼  الباقة:</b> 200GB \n
    <b> 💰  الرصيد المتبقي:</b> 123.12GB \n
    <b> 📅  اخر شحن:</b> 2025-10-10 \n
    <b> 🟢  الحالة على الانترنت:</b> نشط`;
      ctx.replyWithHTML(message);
      await Storage.setItem(`balance-${ctx.from.id}`, false);
      await Storage.setItem(`username-${ctx.from.id}`, false);
    }
  }else if(complaint){
    ctx.reply(
      `شكراً لك يا ${ctx.from.first_name} على إرسال اقتراحك أو شكواك، سنقوم بالرد عليك في أقرب وقت ممكن`
    );
    await Storage.setItem(`complaint-${ctx.from.id}`, false); 
  }
});
