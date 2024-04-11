import { WebClient } from '@slack/web-api';
import { environment } from '../config/environment';

const web: WebClient = new WebClient(environment.SLACK_OAUTH_TOKEN);

const SlackChannelConfig = {
  Notification: environment.SLACK_NOTIFICATION_CHANNEL,
};

/** Slack 메세지 전송 요청시 리턴 타입 */
type SlackResponse = { isSent: boolean; error?: any };

/** Slack 메세지에 환경 정보 타이틀 추가  */
const setEnvToTile = (title: string): string => {
  const envTitle = `(${environment.SERVER_ENV} : ${environment.NODE_ENV})`;
  return `${title} : ${envTitle}`;
};

/** Slack 메세지 전송 */
export const sendSlackMessage = async (
  channel: keyof typeof SlackChannelConfig,
  message: {
    titleColor?: 'good' | 'warning' | 'danger';
    title?: string;
    text: string;
  },
): Promise<SlackResponse> => {
  const { title, titleColor, text } = message;

  try {
    const result = await web.chat.postMessage({
      channel: SlackChannelConfig[channel] || SlackChannelConfig.Notification,
      attachments: [
        {
          ...(title && { title: setEnvToTile(title) }),
          ...(titleColor && { color: titleColor }),
          text,
        },
      ],
    });

    return { isSent: result.ok === true };
  } catch (error) {
    console.error('Slack 메시지 전송 중 오류가 발생했습니다:', error);
    return { isSent: false, error };
  }
};
