
"use strict";

// ======================================
// ตั้งค่าข้อความที่ปรับแต่งได้
// ======================================

const CONFIG = {
  loverName: "My Love",
  birthdayMessage: "ขอให้ปีนี้เต็มไปด้วยความสุข 💕"
};

// หมายเหตุ:
// เว็บไซต์แบบ HTML/JS อย่างเดียวไม่มีระบบตรวจรหัสลับที่ปลอดภัย
// Love Vault ด้านล่างจึงเป็นประตูเซอร์ไพรส์เชิงตกแต่ง
// การกรอกวันเกิดที่ไม่ว่างจะเปิดเว็บไซต์ โดยไม่มีการฝังวันเกิดจริง
// หากต้องการตรวจวันเกิดให้ถูกต้องจริง ต้องเพิ่ม backend ภายหลัง

// ======================================
// ตัวช่วยเลือก element
// ======================================

const $ = (selector) => document.querySelector(selector);

const vault = $("#vault");
const mainSite = $("#mainSite");
const vaultForm = $("#vaultForm");
const birthdayInput = $("#birthdayInput");
const vaultMessage = $("#vaultMessage");

$("#loverName").textContent = CONFIG.loverName;
$("#wishMessage").textContent = CONFIG.birthdayMessage;

// ======================================
// LOVE VAULT
// ======================================

vaultForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const enteredDate = birthdayInput.value.trim();

  if (!enteredDate) {
    vaultMessage.textContent = "ลองใส่วันเกิดก่อนนะ 💗";
    return;
  }

  vaultMessage.textContent = "";

  vault.classList.add("hidden");
  mainSite.classList.remove("hidden");

  window.scrollTo({ top: 0, behavior: "smooth" });
  createHearts(18);
});

// ======================================
// เพลงประกอบ
// ======================================

const music = $("#bgMusic");
const musicToggle = $("#musicToggle");

musicToggle.addEventListener("click", async () => {
  if (!music.paused) {
    music.pause();
    musicToggle.textContent = "♫ Play Music";
    return;
  }

  try {
    await music.play();
    musicToggle.textContent = "♫ Pause Music";
  } catch (error) {
    musicToggle.textContent = "♫ Try Again";
    alert(
      "ยังเล่นเพลงไม่ได้ กรุณาตรวจสอบไฟล์ audio/soft-piano.mp3"
    );
  }
});

music.addEventListener("error", () => {
  musicToggle.textContent = "♫ Add Your Music";
});

// ======================================
// เค้กวันเกิดและคำอธิษฐาน
// ======================================

let candlesBlown = false;

$("#wishBtn").addEventListener("click", () => {
  const candles = $("#candles");
  const cake = $("#cakeEmoji");
  const message = $("#wishMessage");

  if (!candlesBlown) {
    candles.textContent = "✨ ✨ ✨";
    cake.textContent = "🎂";
    message.textContent =
      "เย้! ขอให้ทุกคำอธิษฐานค่อย ๆ เป็นจริงนะ 💗";

    $("#wishBtn").textContent = "Light the Candles Again 🕯️";
    candlesBlown = true;
    createHearts(22);
  } else {
    candles.textContent = "🕯️ 🕯️ 🕯️";
    message.textContent = CONFIG.birthdayMessage;
    $("#wishBtn").textContent = "Blow the Candles ✨";
    candlesBlown = false;
  }
});

$("#confettiBtn").addEventListener("click", () => {
  createHearts(35);
  $("#wishMessage").textContent =
    "ส่งความสุขให้เธอเต็มหน้าจอเลย! 💖";
});

// ======================================
// จดหมายรัก
// ======================================

$("#letterBtn").addEventListener("click", () => {
  const letter = $("#letterContent");
  const isHidden = letter.classList.contains("hidden");

  letter.classList.toggle("hidden");

  $("#letterBtn").textContent = isHidden
    ? "Close My Letter 💌"
    : "Open My Letter 💌";

  if (isHidden) {
    createHearts(10);
  }
});

// ======================================
// ปุ่มเซอร์ไพรส์สุดท้าย
// ======================================

$("#finalBtn").addEventListener("click", () => {
  $("#finalHeart").textContent = "💖";
  $("#finalMessage").textContent =
    "ขอส่งรอยยิ้มและความสุขให้เธออีกหนึ่งครั้งนะ 🌷";

  createHearts(30);
});

// ======================================
// หัวใจลอย
// ======================================

function createHearts(amount = 12) {
  const container = $("#hearts");
  const symbols = ["💗", "💕", "♡", "💖", "🌸"];

  for (let i = 0; i < amount; i++) {
    const heart = document.createElement("span");

    heart.className = "heart-particle";
    heart.textContent =
      symbols[Math.floor(Math.random() * symbols.length)];

    heart.style.left = Math.random() * 100 + "%";
    heart.style.fontSize = 14 + Math.random() * 22 + "px";
    heart.style.animationDuration = 3 + Math.random() * 3 + "s";

    container.appendChild(heart);

    heart.addEventListener("animationend", () => {
      heart.remove();
    }, { once: true });
  }
}

// ======================================
// QR CODE
// ======================================

function setupQRCode() {
  const qrImage = $("#qrImage");
  const qrHint = $("#qrHint");

  // QR Code จะสร้างเมื่อเว็บไซต์มี URL แบบ HTTP/HTTPS
  // ไม่ใช้ file:// เพราะต้องการลิงก์ที่แฟนเปิดจากมือถือได้

  if (window.location.protocol !== "http:" &&
      window.location.protocol !== "https:") {
    qrHint.textContent =
      "นำเว็บไซต์ขึ้นออนไลน์ก่อน แล้ว QR Code จะพร้อมใช้งาน";
    qrImage.classList.add("hidden");
    return;
  }

  const siteURL = window.location.href.split("#")[0];

  // ใช้บริการสร้าง QR Code ออนไลน์ จึงต้องเชื่อมต่ออินเทอร์เน็ต
  const qrURL =
    "https://api.qrserver.com/v1/create-qr-code/?" +
    "size=200x200&data=" + encodeURIComponent(siteURL);

  qrImage.src = qrURL;
  qrImage.classList.remove("hidden");

  qrImage.addEventListener("error", () => {
    qrHint.textContent =
      "ไม่สามารถโหลด QR Code ได้ โปรดลองใหม่เมื่อเชื่อมต่ออินเทอร์เน็ต";
  }, { once: true });

  qrHint.textContent =
    "สแกนเพื่อเปิดเว็บไซต์เซอร์ไพรส์อีกครั้ง ♡";
}

setupQRCode();