import { useGenerationStore } from '../store/generationStore';

class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;

  constructor() {
    this.url = 'ws://localhost:4000/ws';
  }

  private currentJobId: string | null = null;

  connect(jobId: string) {
    if (this.ws && this.currentJobId === jobId) {
      if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
        return; // Already connected or connecting to this job
      }
    }

    if (this.ws) {
      this.ws.close();
    }

    this.currentJobId = jobId;
    const finalUrl = `${this.url}?jobId=${jobId}`;
    console.log('Connecting to WebSocket URL:', finalUrl);
    this.ws = new WebSocket(finalUrl);

    this.ws.onopen = () => {
      console.log('🔗 WebSocket connected for job:', jobId);
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const store = useGenerationStore.getState();

        if (data.type === 'JOB_STATUS') {
          store.updateStatus(data.status, data.progress, data.message);
        } else if (data.type === 'JOB_COMPLETE') {
          store.setResult(data.result);
        } else if (data.type === 'JOB_FAILED') {
          store.setError(data.error);
        }
      } catch (err) {
        console.error('WebSocket message parsing error:', err);
      }
    };

    this.ws.onclose = () => {
      console.log('🔗 WebSocket disconnected');
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.currentJobId = null;
  }
}

export const wsClient = new WebSocketClient();
