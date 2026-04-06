import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoards } from './features/board/boardSlice';
import NavigationBar from './features/navigation/NavigationBar';
import BoardRenderer from './features/board/BoardRenderer';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const boardStatus = useSelector((state) => state.boards.status);

  useEffect(() => {
    if (boardStatus === 'idle') {
      dispatch(fetchBoards());
    }
  }, [boardStatus, dispatch]);

  return (
    <div className="app">
      <NavigationBar />
      <BoardRenderer />
    </div>
  );
}

export default App;
