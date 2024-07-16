import ReactDOM from 'react-dom/client';
/* Se incorpora bs5 */
import 'bootstrap/dist/css/bootstrap.min.css';
/* Se incorporar iconos de BS5 */
import 'bootstrap-icons/font/bootstrap-icons.css';

import TodoList from './components/TodoList';

ReactDOM.createRoot(document.getElementById('root')).render(<TodoList />);
