document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const downloadBtn = document.getElementById('download-btn');
    const preview = document.getElementById('preview');
    const overlay = document.getElementById('video-overlay');
    const statusArea = document.getElementById('recording-status');
    const statusText = document.getElementById('status-text');
    const micToggle = document.getElementById('mic-toggle');

    let mediaRecorder;
    let recordedChunks = [];
    let startTime;
    let timerInterval;

    // 녹화 시작
    async function startRecording() {
        try {
            recordedChunks = [];

            // 화면 공유 스트림 가져오기
            const displayStream = await navigator.mediaDevices.getDisplayMedia({
                video: { cursor: "always" },
                audio: true // 시스템 오디오 포함 여부
            });

            let combinedStream = displayStream;

            // 마이크 오디오 추가 시
            if (micToggle.checked) {
                try {
                    const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    const audioContext = new AudioContext();
                    const destination = audioContext.createMediaStreamDestination();

                    // 화면 오디오 (있는 경우)
                    if (displayStream.getAudioTracks().length > 0) {
                        const source1 = audioContext.createMediaStreamSource(new MediaStream([displayStream.getAudioTracks()[0]]));
                        source1.connect(destination);
                    }

                    // 마이크 오디오
                    const source2 = audioContext.createMediaStreamSource(micStream);
                    source2.connect(destination);

                    combinedStream = new MediaStream([
                        ...displayStream.getVideoTracks(),
                        ...destination.stream.getAudioTracks()
                    ]);
                } catch (err) {
                    console.error("마이크 권한 거부됨:", err);
                    alert("마이크 오디오를 사용하려면 권한이 필요합니다.");
                }
            }

            preview.srcObject = displayStream; // 미리보기는 딜레이 없는 displayStream 사용
            preview.style.display = 'block';
            overlay.style.display = 'none';

            // MediaRecorder 설정
            const options = { mimeType: 'video/webm; codecs=vp9' };
            mediaRecorder = new MediaRecorder(combinedStream, options);

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    recordedChunks.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                stopTimer();
                statusArea.style.display = 'none';
                startBtn.disabled = false;
                stopBtn.disabled = true;
                downloadBtn.disabled = false;

                // 스트림 종료
                displayStream.getTracks().forEach(track => track.stop());
            };

            // 녹화 시작
            mediaRecorder.start();

            // UI 업데이트
            startBtn.disabled = true;
            stopBtn.disabled = false;
            downloadBtn.disabled = true;
            statusArea.style.display = 'flex';

            startTimer();

            // 화면 공유 중단 버튼 대응
            displayStream.getVideoTracks()[0].onended = () => {
                if (mediaRecorder.state === 'recording') {
                    stopRecording();
                }
            };

        } catch (err) {
            console.error("Error starting recording:", err);
            if (err.name !== 'NotAllowedError') {
                alert("녹화를 시작할 수 없습니다: " + err.message);
            }
        }
    }

    // 녹화 중지
    function stopRecording() {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
        }
    }

    // 다운로드
    function downloadRecording() {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `screen-recording-${new Date().getTime()}.webm`;
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    }

    // 타이머
    function startTimer() {
        startTime = Date.now();
        timerInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const h = Math.floor(elapsed / 3600000);
            const m = Math.floor((elapsed % 3600000) / 60000);
            const s = Math.floor((elapsed % 60000) / 1000);
            statusText.textContent = `REC ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    // 버튼 이벤트
    startBtn.addEventListener('click', startRecording);
    stopBtn.addEventListener('click', stopRecording);
    downloadBtn.addEventListener('click', downloadRecording);
});
