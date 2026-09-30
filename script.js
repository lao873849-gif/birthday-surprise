"use strict";

// =====================================================
// ตั้งค่าหลัก — แก้รหัสตรงนี้
// =====================================================
const CONFIG = {
  // ตัวอย่าง 140625 = 14/06/25
  // ใส่เป็นตัวเลขติดกันเท่านั้น เพราะหน้า Love Vault เป็น keypad
  vaultCode: "140625",
  loverName: "My Love",
  birthdayMessage: "ขอให้ปีนี้เต็มไปด้วยความสุข 💕"
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

// =====================================================
// LOVE VAULT — ต้องกรอกรหัสตรงเท่านั้น
// =====================================================
let enteredCode = "";
const codeDisplay = $("#codeDisplay");
const vault = $("#vault");
const mainSite = $("#mainSite");

function renderCode(){
  codeDisplay.innerHTML = "";
  for(let i = 0; i < CONFIG.vaultCode.length; i++){
    const dot = document.createElement("span");
    dot.className = "code-dot" + (enteredCode[i] ? " filled" : "");
    codeDisplay.appendChild(dot);
  }
}
renderCode();

$$('.keypad [data-key]').forEach(button => {
  button.addEventListener('click', () => {
    if(enteredCode.length < CONFIG.vaultCode.length){
      enteredCode += button.dataset.key;
      renderCode();
    }
  });
});

$("#backspace").addEventListener("click", () => {
  enteredCode = enteredCode.slice(0, -1);
  $("#vaultMessage").textContent = "";
  renderCode();
});

$("#enter").addEventListener("click", () => {
  if(enteredCode === CONFIG.vaultCode){
    $("#vaultMessage").textContent = "เปิดความลับของเราแล้ว ♡";
    createHearts(20);
    setTimeout(() => {
      vault.classList.add("hidden");
      mainSite.classList.remove("hidden");
      location.hash = "cake";
      window.scrollTo({top:0, behavior:"smooth"});
    }, 450);
  }else{
    $("#vaultMessage").textContent = "รหัสยังไม่ถูกนะ ลองนึกถึงวันพิเศษของเราดู ♡";
    enteredCode = "";
    renderCode();
    vault.classList.add("shake");
    setTimeout(() => vault.classList.remove("shake"), 350);
  }
});

// =====================================================
// เพลง — ใช้โค้ดเดิมของเว็บไซต์
// =====================================================
const music = $("#bgMusic");
const musicToggle = $("#musicToggle");
musicToggle.addEventListener("click", async () => {
  if(!music.paused){
    music.pause();
    musicToggle.textContent = "♫ Play Music";
    return;
  }
  try{
    await music.play();
    musicToggle.textContent = "♫ Pause Music";
  }catch(error){
    musicToggle.textContent = "♫ Add Your Music";
  }
});
music.addEventListener("error", () => musicToggle.textContent = "♫ Add Your Music");

// =====================================================
// 02 CAKE — คลิกจุด + เพื่อปักเทียนจริงทีละเล่ม
// =====================================================
let candlesPlaced = 0;
const candlePositions = ["candle-pos-1","candle-pos-2","candle-pos-3","candle-pos-4"];

function placeCandle(number){
  if(number !== candlesPlaced + 1) {
    showHint("ปักตามลำดับทีละเล่มนะ 🕯️");
    return;
  }
  const spot = $(`.candle-spot[data-candle="${number}"]`);
  spot.classList.add("placed");
  spot.querySelector("span").textContent = "✓";

  const candle = document.createElement("div");
  candle.className = `real-candle ${candlePositions[number-1]}`;
  candle.innerHTML = `<span class="flame"></span>`;
  $("#placedCandles").appendChild(candle);

  candlesPlaced++;
  $("#candleCount").textContent = `${candlesPlaced} / 4`;
  $("#wishBtn").innerHTML = candlesPlaced < 4
    ? `ปักเทียน 🕯️ <span>${candlesPlaced} / 4</span>`
    : `อธิษฐานได้แล้ว ✨ <span>4 / 4</span>`;

  if(candlesPlaced === 4){
    $("#wishMessage").textContent = "ครบ 4 เล่มแล้ว ✨ หลับตาขอพรได้เลยนะ";
    $("#toMemory").classList.remove("hidden");
    createHearts(25);
    showHint("เย้! เทียนครบทั้ง 4 เล่มแล้ว 🎂💗");
  }
}

$$('.candle-spot').forEach(spot => {
  spot.addEventListener('click', () => placeCandle(Number(spot.dataset.candle)));
});

$("#wishBtn").addEventListener("click", () => {
  if(candlesPlaced < 4) placeCandle(candlesPlaced + 1);
  else createHearts(20);
});

$("#toMemory").addEventListener("click", () => {
  setupMemoryGame();
  document.querySelector("#memories").scrollIntoView({behavior:"smooth"});
});

// =====================================================
// 03 MINI GAME — จับคู่รูป 3 คู่ / 6 ใบ
// =====================================================
const memoryImages = ["images/photo1.jpg","images/photo2.jpg","images/photo3.jpg"];
let firstCard = null;
let secondCard = null;
let memoryLocked = false;
let pairsFound = 0;

function setupMemoryGame(){
  const grid = $("#memoryGrid");
  grid.innerHTML = "";
  pairsFound = 0;
  firstCard = null;
  secondCard = null;
  memoryLocked = false;
  $("#pairsFound").textContent = "0";
  $("#memoryHint").textContent = "แตะรูป 2 ใบที่คิดว่าเป็นคู่เดียวกัน";
  $("#toLetter").classList.add("hidden");

  const deck = [0,1,2,0,1,2].sort(() => Math.random() - .5);
  deck.forEach((type, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "memory-card";
    card.dataset.type = type;
    card.dataset.index = index;
    card.innerHTML = `
      <span class="memory-inner">
        <span class="memory-face memory-back">♡</span>
        <span class="memory-face memory-front"><img src="${memoryImages[type]}" alt="ความทรงจำ"></span>
      </span>`;
    card.addEventListener("click", () => flipMemoryCard(card));
    grid.appendChild(card);
  });
}

function flipMemoryCard(card){
  if(memoryLocked || card === firstCard || card.classList.contains("matched")) return;
  card.classList.add("flipped");
  if(!firstCard){ firstCard = card; return; }
  secondCard = card;
  memoryLocked = true;

  if(firstCard.dataset.type === secondCard.dataset.type){
    setTimeout(() => {
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");
      pairsFound++;
      $("#pairsFound").textContent = pairsFound;
      firstCard = null;
      secondCard = null;
      memoryLocked = false;
      if(pairsFound === 3){
        $("#memoryHint").textContent = "จับคู่ครบแล้ว! ความทรงจำของเราน่ารักที่สุดเลย 💗";
        $("#toLetter").classList.remove("hidden");
        createHearts(18);
      }
    }, 420);
  }else{
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      firstCard = null;
      secondCard = null;
      memoryLocked = false;
    }, 850);
  }
}

$("#toLetter").addEventListener("click", () => {
  $("#letter").scrollIntoView({behavior:"smooth"});
});

// =====================================================
// 04 A LETTER FOR YOU + FINAL SURPRISE
// =====================================================
$("#letterBtn").addEventListener("click", () => {
  createHearts(18);
  $("#finalHeart").textContent = "💖";
  $("#finalMessage").textContent = CONFIG.birthdayMessage + " 🌷";
  $("#qr").scrollIntoView({behavior:"smooth"});
});

$("#finalBtn").addEventListener("click", () => {
  $("#finalHeart").textContent = "💗💗💗";
  $("#finalMessage").textContent = "ส่งรอยยิ้มและความรักให้เธออีกหนึ่งครั้งนะ ♡";
  createHearts(35);
});

// =====================================================
// หัวใจลอย
// =====================================================
function createHearts(amount = 12){
  const container = $("#hearts");
  const symbols = ["💗","💕","♡","💖","✦","🌸"];
  for(let i=0;i<amount;i++){
    const heart = document.createElement("span");
    heart.className = "heart-particle";
    heart.textContent = symbols[Math.floor(Math.random()*symbols.length)];
    heart.style.left = Math.random()*100 + "%";
    heart.style.fontSize = 14 + Math.random()*22 + "px";
    heart.style.animationDuration = 3 + Math.random()*3 + "s";
    container.appendChild(heart);
    heart.addEventListener("animationend", () => heart.remove(), {once:true});
  }
}

function showHint(message){
  const hint = $("#wishMessage");
  hint.textContent = message;
  clearTimeout(window.__hintTimer);
  window.__hintTimer = setTimeout(() => {
    if(candlesPlaced < 4) hint.textContent = "แตะเครื่องหมาย + บนเค้กทีละจุดให้ครบ 4 เล่มนะ 💗";
  }, 1800);
}

// =====================================================
// QR CODE — ของเดิมยังคงอยู่
// =====================================================
function setupQRCode(){
  const qrImage = $("#qrImage");
  const qrHint = $("#qrHint");
  if(window.location.protocol !== "http:" && window.location.protocol !== "https:"){
    qrHint.textContent = "นำเว็บไซต์ขึ้นออนไลน์ก่อน แล้ว QR Code จะพร้อมใช้งาน";
    qrImage.classList.add("hidden");
    return;
  }
  const siteURL = window.location.href.split("#")[0];
  qrImage.src = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + encodeURIComponent(siteURL);
  qrImage.classList.remove("hidden");
  qrHint.textContent = "สแกนเพื่อเปิดเว็บไซต์เซอร์ไพรส์อีกครั้ง ♡";
}
setupQRCode();
