// ! Logs:
// ! 3-7-24 - loading structure
// ! 4-7-24 - filteration features
// ! 5-7-24 - fiterin, max, min debug + styling
// ! Rem - API call for all filteration realted stuff + ids
// ! - Dipen
import { 
  BrowserRouter, 
  Routes, 
  Route ,
  // TODO useNavigate 
} from 'react-router-dom';

import { CssBaseline } from '@mui/material';

import AllProductsPage from "./components/AllProductsPage";
import IndexedItem from "./components/IndexedItem";


const App = () => {
  return (
    <BrowserRouter>
      <CssBaseline />
      <Routes>
        <Route exact path="/" element={<AllProductsPage />} />
        <Route exact path="/products/:id" element={
          <>
            <IndexedItem />
          </>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;