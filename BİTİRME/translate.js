const video = document.getElementById('video');
const predictionResult = document.getElementById('prediction-result');
let model;
let sequence = [];
const sequenceLength = 30; // 30 frame
const threshold = 0.2; // Minimum tahmin güven eşiği
const words = ["kelime1", "kelime2", "kelime3"]; // Burada kelimelerinizi yazın

// Modeli Yükleme
async function loadModel() {
    model = await tf.loadLayersModel('actions_model/model.json');
    console.log("Model yüklendi.");
}

// Kamerayı Başlatma
async function startVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    });
    video.srcObject = stream;
    video.play();
}

// Tahmin Yapma
async function predict() {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Keypointleri al ve modele uygula
    const imageTensor = tf.browser.fromPixels(canvas).resizeBilinear([224, 224]);
    // Burada Mediapipe veya başka bir keypoint çıkartıcı ekleyebilirsiniz
    // Örnek: keypoints = extractKeypoints(imageTensor);

    if (sequence.length === sequenceLength) {
        const prediction = await model.predict(tf.expandDims(tf.tensor(sequence), 0)).data();
        const maxIndex = prediction.indexOf(Math.max(...prediction));

        if (prediction[maxIndex] > threshold) {
            predictionResult.textContent = words[maxIndex];
        }
        sequence = []; // Reset sequence
    }
}

// Periyodik Tahmin
function loopPrediction() {
    predict();
    requestAnimationFrame(loopPrediction);
}

// Başlat
(async () => {
    await loadModel();
    await startVideo();
    loopPrediction();
})();
