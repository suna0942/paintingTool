// 저장 관련 변수
const saveBtn = document.getElementById("save");
const imgName = document.getElementById("image-name");
const imgExtensions = document.getElementById("save-extension");
// file, text 추가 관련 변수
const textInput = document.getElementById("text");
const fileInput = document.getElementById("file");
const fileSize = document.getElementById("fileSize");
const fileSpotX = document.getElementById("file-spot-x");
const fileSpotY = document.getElementById("file-spot-y");
const showFileSize = document.querySelector("label[for=fileSize] span");
// 색상 관련 변수
const colorOptions = Array.from(document.getElementsByClassName("color-option"));
const color = document.getElementById("color");
const showColorValue = document.getElementById("color-value");
// 선 굵기 관련 변수
const lineWidth = document.getElementById("line-width");
const showLineWidthValue = document.getElementById("line-value");
// 기타 버튼 변수
const modeBtn = document.getElementById("mode-btn");
const destroyBtn = document.getElementById("destroy-btn");
const eraserBtn = document.getElementById("eraser-btn");

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

ctx.lineWidth = lineWidth.value;
ctx.lineCap = "round";
showLineWidthValue.innerText = `선 굵기: ${lineWidth.value}`;
showColorValue.innerText = `색상: ${color.value}`;

let isPainting = false;
let isFilling = false;
let colorValue = '';
let fileSizeValue = fileSize.value;

function onMove(e) {
  if (isPainting) {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    return;
  }
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
};

function startPainting() {
  isPainting = true;
};

function cancelPainting() {
  isPainting = false;
};

function showValue(colorValue){
  showColorValue.innerText = `색상: ${colorValue}`;
};

function onLineWidthChange(e) {
  const lineValue = e.target.value;
  ctx.lineWidth = lineValue;
  showLineWidthValue.innerText = `선 굵기: ${lineValue}`;
};

function onFileSizeChange(e){
  fileSizeValue = e.target.value;
  showFileSize.innerText = `${fileSizeValue}`;
};

function onColorChange(e) {
  colorValue = e.target.value;
  showValue(colorValue);
  ctx.strokeStyle = colorValue;
  ctx.fillStyle = colorValue;
};

function onColorClick(e) {
  colorValue = e.target.dataset.color;
  ctx.strokeStyle = colorValue;
  ctx.fillStyle = colorValue;
  color.value = colorValue;
  showValue(colorValue);
};

function onModeClick(e){
  if(isFilling){
    isFilling = false;
    modeBtn.innerText = "🎨 Fill";
  }
  else {
    isFilling = true;
    modeBtn.innerText = "🖌 Draw";
  }
};

function onCanvasClick(){
  if(isFilling){
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
};

function onDestroyClick(){
  const isReset = confirm("정말 지우시겠습니까?");
  if(isReset){
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
};

function onEraserClick(){
  ctx.strokeStyle = "white";
  isFilling = false;
  modeBtn.innerText = "🎨 Fill";
};

function onFileChange(e){
  const file = e.target.files[0];
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.src = url;
  image.onload = function(){
    const imageWidth = CANVAS_WIDTH * (fileSizeValue / 100);
    const imageHeight = CANVAS_HEIGHT * (fileSizeValue / 100);
    const x = fileSpotX.value;
    const y = fileSpotY.value;
    ctx.drawImage(image, x, y, imageWidth, imageHeight);
    fileInput.value = null;
  };
};

function onDoubleClick(e){
  const text = textInput.value;
  if(text !== ""){
    ctx.save();
    ctx.lineWidth = 1;
    ctx.font = '54px twayair';
    ctx.fillText(text, e.offsetX, e.offsetY);
    ctx.restore();
  }
};

function onSaveClick(){
  const url = canvas.toDataURL();
  const a = document.createElement('a');
  const imgSaveName = imgName.value;
  const regExp = /^\s+$/g;
  if(regExp.test(imgSaveName) || imgSaveName === ''){
    alert('저장하실 파일 이름을 작성해주세요');
    return;
  }
  const imgExtension = imgExtensions.value;
  a.href = url;
  a.download = `${imgSaveName}.${imgExtension}`;
  a.click();
};

canvas.addEventListener("dblclick", onDoubleClick);
canvas.addEventListener('mousemove', onMove);
canvas.addEventListener('mousedown', startPainting);
canvas.addEventListener('mouseup', cancelPainting);
canvas.addEventListener('mouseleave', cancelPainting);
canvas.addEventListener('click', onCanvasClick);

lineWidth.addEventListener('change', onLineWidthChange);
color.addEventListener('change', onColorChange);
fileSize.addEventListener('change', onFileSizeChange);
colorOptions.forEach(color => color.addEventListener('click', onColorClick));
modeBtn.addEventListener('click', onModeClick);
destroyBtn.addEventListener('click', onDestroyClick);
eraserBtn.addEventListener('click', onEraserClick);
fileInput.addEventListener('change', onFileChange);
saveBtn.addEventListener('click', onSaveClick);

