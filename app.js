// --- المتغيرات الأساسية ---
const list = document.getElementById("list-comment");
const form = document.getElementById("form-comment");
const submitBtn = document.getElementById("submit-btn");
const url = "https://jsonplaceholder.typicode.com/comments";

let isEditing = false;
let selectedId = null;
let elementToEdit = null;

// --- 1. جلب التعليقات ---
function getComments() {
  fetch(url + "?_limit=10")
    .then((res) => res.json())
    .then((data) => {
      list.innerHTML = "";
      data.forEach((comment) => commentRender(comment));
    });
}

// --- 2. التحكم بالإرسال ---
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const dataComment = {
    name: document.getElementById("Idname").value,
    email: document.getElementById("Idemail").value,
    body: document.getElementById("Idbody").value,
  };

  if (isEditing) {
    commentUpdate(selectedId, dataComment, elementToEdit);
  } else {
    createComment(dataComment);
  }

  form.reset();
});

// --- 3. إضافة تعليق جديد ---
function createComment(data) {
  commentRender(data, true);
  fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-type": "application/json" },
  });
}

// --- 4. تحديث تعليق ---
function commentUpdate(id, data, element) {
  element.querySelector("h3 span").innerText = data.name;
  element.querySelector(".email-text").innerText = data.email;
  element.querySelector(".body-text").innerText = data.body;

  fetch(url + "/" + id, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: { "Content-type": "application/json" },
  });

  // إعادة الزر للوضع الطبيعي
  isEditing = false;
  selectedId = null;
  elementToEdit = null;
  submitBtn.querySelector("span").innerText = "إضافة تعليق";
  submitBtn.querySelector("i").className = "fas fa-paper-plane";
}

// --- 5. حذف تعليق ---
function commentRemove(id, element) {
  if (confirm("هل أنت متأكد من حذف هذا التعليق؟")) {
    element.remove();
    fetch(url + "/" + id, { method: "DELETE" });
  }
}

// --- 6. رسم التعليق في الصفحة ---
function commentRender(comment, isNew = false) {
  const div = document.createElement("div");
  div.classList.add("comment-card");

  div.innerHTML = `
        <h3><i class="fas fa-user-circle"></i> <span>${comment.name}</span></h3>
        <p><i class="fas fa-at"></i> <strong>البريد الإلكتروني:</strong> <span class="email-text">${comment.email}</span></p>
        <p class="body-text">${comment.body}</p>
        <div class="actions">
            <button class="edit-btn"><i class="fas fa-edit"></i> تعديل</button>
            <button class="delete-btn"><i class="fas fa-trash"></i> حذف</button>
        </div>
    `;

  div.querySelector(".delete-btn").onclick = () =>
    commentRemove(comment.id, div);

  div.querySelector(".edit-btn").onclick = () => {
    document.getElementById("Idname").value = comment.name;
    document.getElementById("Idemail").value = comment.email;
    document.getElementById("Idbody").value = comment.body;

    isEditing = true;
    selectedId = comment.id;
    elementToEdit = div;

    // تحديث الزر ليصبح "تحديث"
    submitBtn.querySelector("span").innerText = "تحديث التعليق";
    submitBtn.querySelector("i").className = "fas fa-sync-alt";

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isNew) list.prepend(div);
  else list.appendChild(div);
}

getComments();
// // --- المتغيرات الأساسية (عشان نوصل لعناصر الصفحة) ---
// const list = document.getElementById("list-comment");
// const form = document.getElementById("form-comment");
// const submitBtn = document.getElementById("submit-btn");
// const url = "https://jsonplaceholder.typicode.com/comments";

// // متغيرات إذا كنا بنعدل كومنت ولا بنضيف واحد جديد
// let isEditing = false;
// let selectedId = null;
// let elementToEdit = null;

// // --- أول خطوة: نجيب الكومنتات من السيرفر ونعرضها ---
// function getComments() {
//   fetch(url + "?_limit=10")
//     .then((response) => response.json())
//     .then((dataList) => {
//       list.innerHTML = ""; // نمسح القائمة القديمة قبل ما نضيف الجديد
//       dataList.forEach((comment) => commentRender(comment));
//     });
// }

// // --- ثاني خطوة: التحكم في زر الإرسال (إضافة أو تعديل) ---
// form.addEventListener("submit", function (e) {
//   e.preventDefault(); // نمنع الصفحة إنها تعمل تحديث

//   // نسحب البيانات اللي كتبها المستخدم في الفورم
//   const dataComment = {
//     name: document.getElementById("Idname").value,
//     email: document.getElementById("Idemail").value,
//     body: document.getElementById("Idbody").value,
//   };

//   if (isEditing) {
//     // لو كنا بنعدل، ننفذ دالة التحديث
//     commentUpdate(selectedId, dataComment, elementToEdit);
//   } else {
//     // لو كومنت جديد، ننشئه من الصفر
//     createComment(dataComment);
//   }

//   form.reset(); // نمسح الخانات بعد الإرسال عشان تفضى للمستخدم
// });

// // --- دالة إضافة كومنت جديد ---
// function createComment(data) {
//   commentRender(data, true); // نعرض الكومنت فوراً في الصفحة
//   fetch(apiUrl, {
//     method: "POST",
//     body: JSON.stringify(data),
//     headers: { "Content-type": "application/json" },
//   });
// }

// // --- دالة تحديث كومنت موجود أصلاً ---
// function commentUpdate(id, data, element) {
//   // نحدث البيانات في واجهة الصفحة قدام المستخدم
//   element.querySelector("h3").innerText = data.name;
//   element.querySelector(".email-text").innerText = data.email;
//   element.querySelector(".body-text").innerText = data.body;

//   // نبعث التحديث للسيرفر
//   fetch(apiUrl + "/" + id, {
//     method: "PUT",
//     body: JSON.stringify(data),
//     headers: { "Content-type": "application/json" },
//   });

//   // نرجع كل شيء لوضعه الطبيعي بعد التعديل
//   isEditing = false;
//   selectedId = null;
//   elementToEdit = null;
//   submitBtn.innerText = "Add Comment";
// }

// // --- دالة حذف الكومنت ---
// function commentRemove(id, element) {
//   element.remove(); // نشيله من الصفحة
//   fetch(apiUrl + "/" + id, { method: "DELETE" }); // نحذفه من السيرفر
// }

// // --- دالة رسم الكومنت وعرضه في الـ HTML ---
// function commentRender(comment, isNew = false) {
//   const div = document.createElement("div");
//   div.classList.add("comment-card");

//   div.innerHTML = `
//         <h3>${comment.name}</h3>
//         <p><strong>Email:</strong> <span class="email-text">${comment.email}</span></p>
//         <p class="body-text">${comment.body}</p>
//         <div class="actions">
//             <button class="edit-btn">Edit</button>
//             <button class="delete-btn">Delete</button>
//         </div>
//     `;

//   // ربط زر الحذف بالدالة بتاعته
//   div.querySelector(".delete-btn").onclick = () =>
//     commentRemove(comment.id, div);

//   // ربط زر التعديل وتعبئة الفورم بالبيانات القديمة
//   div.querySelector(".edit-btn").onclick = () => {
//     document.getElementById("Idname").value = comment.name;
//     document.getElementById("Idemail").value = comment.email;
//     document.getElementById("Idbody").value = comment.body;

//     isEditing = true;
//     selectedId = comment.id;
//     elementToEdit = div;
//     submitBtn.innerText = "Update Comment"; // نغير اسم الزرار لتنبيه المستخدم
//   };

//   // لو الكومنت جديد نحطه في الأول، لو قديم نحطه في الآخر
//   if (isNew) list.prepend(div);
//   else list.appendChild(div);
// }

// // تشغيل الدالة الأساسية أول ما نفتح الصفحة
// getComments();
