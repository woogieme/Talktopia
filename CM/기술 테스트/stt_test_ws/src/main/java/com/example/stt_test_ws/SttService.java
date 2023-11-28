package com.example.stt_test_ws;

import com.google.api.gax.longrunning.OperationFuture;
import com.google.api.gax.longrunning.OperationTimedPollAlgorithm;
import com.google.api.gax.retrying.RetrySettings;
import com.google.api.gax.retrying.TimedRetryAlgorithm;
import com.google.api.gax.rpc.ApiStreamObserver;
import com.google.api.gax.rpc.BidiStreamingCallable;
import com.google.api.gax.rpc.ClientStream;
import com.google.api.gax.rpc.ResponseObserver;
import com.google.api.gax.rpc.StreamController;
import com.google.cloud.speech.v1.LongRunningRecognizeMetadata;
import com.google.cloud.speech.v1.LongRunningRecognizeResponse;
import com.google.cloud.speech.v1.RecognitionAudio;
import com.google.cloud.speech.v1.RecognitionConfig;
import com.google.cloud.speech.v1.RecognitionConfig.AudioEncoding;
import com.google.cloud.speech.v1.RecognizeResponse;
import com.google.cloud.speech.v1.SpeechClient;
import com.google.cloud.speech.v1.SpeechRecognitionAlternative;
import com.google.cloud.speech.v1.SpeechRecognitionResult;
import com.google.cloud.speech.v1.SpeechSettings;
import com.google.cloud.speech.v1.StreamingRecognitionConfig;
import com.google.cloud.speech.v1.StreamingRecognitionResult;
import com.google.cloud.speech.v1.StreamingRecognizeRequest;
import com.google.cloud.speech.v1.StreamingRecognizeResponse;
import com.google.cloud.speech.v1.WordInfo;
import com.google.common.util.concurrent.SettableFuture;
import com.google.protobuf.ByteString;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import javax.sound.sampled.AudioFormat;
import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.DataLine;
import javax.sound.sampled.DataLine.Info;
import javax.sound.sampled.TargetDataLine;

import org.springframework.stereotype.Service;
import org.threeten.bp.Duration;

@Service
public class SttService {
	/**
	 * Performs streaming speech recognition on raw PCM audio data.
	 *
	 */
	public String streamingRecognizeFile(byte[] data) throws Exception, IOException {
		// Path path = Paths.get(fileName);
		// byte[] data = Files.readAllBytes(path);
		StringBuilder sb = new StringBuilder();

		// Instantiates a client with GOOGLE_APPLICATION_CREDENTIALS
		try (SpeechClient speech = SpeechClient.create()) {

			// Configure request with local raw PCM audio
			RecognitionConfig recConfig =
				RecognitionConfig.newBuilder()
					.setEncoding(AudioEncoding.LINEAR16)
					.setLanguageCode("ko-KR")
					.setSampleRateHertz(16000)
					.setModel("default")
					.build();
			StreamingRecognitionConfig config =
				StreamingRecognitionConfig.newBuilder().setConfig(recConfig).build();

			class ResponseApiStreamingObserver<T> implements ApiStreamObserver<T> {
				private final SettableFuture<List<T>> future = SettableFuture.create();
				private final List<T> messages = new java.util.ArrayList<T>();

				@Override
				public void onNext(T message) {
					messages.add(message);
				}

				@Override
				public void onError(Throwable t) {
					future.setException(t);
				}

				@Override
				public void onCompleted() {
					future.set(messages);
				}

				// Returns the SettableFuture object to get received messages / exceptions.
				public SettableFuture<List<T>> future() {
					return future;
				}
			}

			ResponseApiStreamingObserver<StreamingRecognizeResponse> responseObserver =
				new ResponseApiStreamingObserver<>();

			BidiStreamingCallable<StreamingRecognizeRequest, StreamingRecognizeResponse> callable =
				speech.streamingRecognizeCallable();

			ApiStreamObserver<StreamingRecognizeRequest> requestObserver =
				callable.bidiStreamingCall(responseObserver);

			// The first request must **only** contain the audio configuration:
			requestObserver.onNext(
				StreamingRecognizeRequest.newBuilder().setStreamingConfig(config).build());

			// Subsequent requests must **only** contain the audio data.
			requestObserver.onNext(
				StreamingRecognizeRequest.newBuilder()
					.setAudioContent(ByteString.copyFrom(data))
					.build());

			// Mark transmission as completed after sending the data.
			requestObserver.onCompleted();

			List<StreamingRecognizeResponse> responses = responseObserver.future().get();

			for (StreamingRecognizeResponse response : responses) {
				// For streaming recognize, the results list has one is_final result (if available) followed
				// by a number of in-progress results (if iterim_results is true) for subsequent utterances.
				// Just print the first result here.
				StreamingRecognitionResult result = response.getResultsList().get(0);
				// There can be several alternative transcripts for a given chunk of speech. Just use the
				// first (most likely) one here.
				SpeechRecognitionAlternative alternative = result.getAlternativesList().get(0);
				System.out.printf("Transcript : %s\n", alternative.getTranscript());
				sb.append(alternative.getTranscript()).append("\n");
			}
		}
		return sb.toString();
	}

	/**
	 * Performs speech recognition on raw PCM audio and prints the transcription.
	 * https://cloud.google.com/speech-to-text/docs/sync-recognize?hl=ko
	 * @return
	 */
	public String syncRecognizeAudio(byte[] audioData) throws Exception {
		StringBuilder sb = new StringBuilder();
		try (SpeechClient speech = SpeechClient.create()) {
			System.out.println("1");
			ByteString audioBytes = ByteString.copyFrom(audioData);

			// Configure request with local raw PCM audio
			RecognitionConfig config =
				RecognitionConfig.newBuilder()
					.setEncoding(RecognitionConfig.AudioEncoding.LINEAR16)
					.setLanguageCode("ko-KR")
					.setSampleRateHertz(16000)
					.build();
			System.out.println("2");

			RecognitionAudio audio = RecognitionAudio.newBuilder().setContent(audioBytes).build();
			System.out.println("3");

			// Use blocking call to get audio transcript
			RecognizeResponse response = speech.recognize(config, audio); // 설정과 오디오 기반으로 음성인식 수행
			System.out.println("4");

			List<SpeechRecognitionResult> results = response.getResultsList();
			System.out.println("5");

			for (SpeechRecognitionResult result : results) {
				// There can be several alternative transcripts for a given chunk of speech. Just use the
				// first (most likely) one here.
				SpeechRecognitionAlternative alternative = result.getAlternativesList().get(0);
				System.out.printf("Transcription: %s%n", alternative.getTranscript());
				sb.append(alternative.getTranscript()).append("\n");
			}
		}
		return sb.toString();
	}

	/**
	 * Performs non-blocking speech recognition on remote FLAC file and prints the transcription.
	 *
	 // * @param gcsUri the path to the remote LINEAR16 audio file to transcribe.
	 */
	public String asyncRecognizeGcs(byte[] data) throws Exception {
		StringBuilder sb =new StringBuilder();
		ByteString audioBytes = ByteString.copyFrom(data);

		// Configure polling algorithm
		SpeechSettings.Builder speechSettings = SpeechSettings.newBuilder();
		TimedRetryAlgorithm timedRetryAlgorithm =
			OperationTimedPollAlgorithm.create(
				RetrySettings.newBuilder()
					.setInitialRetryDelay(Duration.ofMillis(500L))
					.setRetryDelayMultiplier(1.5)
					.setMaxRetryDelay(Duration.ofMillis(5000L))
					.setInitialRpcTimeout(Duration.ZERO) // ignored
					.setRpcTimeoutMultiplier(1.0) // ignored
					.setMaxRpcTimeout(Duration.ZERO) // ignored
					.setTotalTimeout(Duration.ofHours(24L)) // set polling timeout to 24 hours
					.build());
		speechSettings.longRunningRecognizeOperationSettings().setPollingAlgorithm(timedRetryAlgorithm);

		// Instantiates a client with GOOGLE_APPLICATION_CREDENTIALS
		try (SpeechClient speech = SpeechClient.create(speechSettings.build())) {

			// Configure remote file request for FLAC
			RecognitionConfig config =
				RecognitionConfig.newBuilder()
					.setEncoding(RecognitionConfig.AudioEncoding.FLAC)
					.setLanguageCode("ko-KR")
					.setSampleRateHertz(16000)
					.build();
			// RecognitionAudio audio = RecognitionAudio.newBuilder().setUri(gcsUri).build();
			RecognitionAudio audio = RecognitionAudio.newBuilder().setContent(audioBytes).build();

			// Use non-blocking call for getting file transcription
			OperationFuture<LongRunningRecognizeResponse, LongRunningRecognizeMetadata> response =
				speech.longRunningRecognizeAsync(config, audio);
			while (!response.isDone()) {
				System.out.println("Waiting for response...");
				Thread.sleep(10000);
			}

			List<SpeechRecognitionResult> results = response.get().getResultsList();

			for (SpeechRecognitionResult result : results) {
				// There can be several alternative transcripts for a given chunk of speech. Just use the
				// first (most likely) one here.
				SpeechRecognitionAlternative alternative = result.getAlternativesList().get(0);
				System.out.printf("Transcription: %s\n", alternative.getTranscript());
				sb.append(alternative.getTranscript()).append(" ");
			}
		}
		return sb.toString();
	}

}
