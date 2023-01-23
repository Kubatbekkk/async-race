import './style.css';
import './api/apiProvider';
import './api/paths';
import './app/app';
import './app/appController';
import './app/appView';

import App from './app/app';
import { AppModel } from './models/app.model';

const app: AppModel = new App();
app.start();
