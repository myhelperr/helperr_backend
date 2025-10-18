import morgan from 'morgan';
import { globalLog } from './loggerConfig';
import { NODE_ENV } from './envConfig';

const beeFormat = `:remote-addr - :remote-user [:date[web]] ":method :url [HTTP VERSION=:http-version]" :status :res[content-length] :user-agent :response-time ms`;

const devFormat = `:method :url :status :response-time ms - :res[content-length]`;

const format = NODE_ENV === 'prod' ? beeFormat : devFormat;

export default morgan(format, {
    stream: { write: (message: string) => globalLog.info(message) },
});
