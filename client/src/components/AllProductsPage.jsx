import React, { useState, useEffect } from "react";

import { styled } from "@mui/system";

import axios from 'axios';

import {
  AppBar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Dialog,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Pagination,
  Select,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

import { 
  ArrowDownward, 
  ArrowUpward, 
  Menu, 
  Star 
} from "@mui/icons-material";

// ! Variables
const API_BASE_URL = "/api";
const DummyIMG ="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/PxG_GVE_Blog_Header-bike_1.width-1300.png";

// ! Stylings
const CustomBorderTextField = styled(TextField)`
  & label.Mui-focused {
    color: #dc6601;
  }
  & .MuiOutlinedInput-root {
    &.Mui-focused fieldset {
      border-color: #dc6601;
    }
  }
`;
const CustomBorderTextField2 = styled(TextField)`
  & label.Mui-focused {
    // invis
    color: transparent;
  }
  & .MuiOutlinedInput-root {
    &.Mui-focused fieldset {
      border-color: transparent;
    }
  }
`;
  // siderbar
const CustomBorderFormControl = styled(FormControl)`
  & .MuiInputLabel-root.Mui-focused {
    color: #dc6601;
  }
  & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: #dc6601;
  }
`;
const CustomPaginationContainer = styled("div")`
  display: flex;
  justify-content: center;
  margin-top: 20px;

  & .MuiPagination-ul .Mui-selected {
    background-color: #dc6601;
    color: white;
  }
  & .MuiPagination-ul .MuiPaginationItem-root.Mui-selected:hover {
    background-color: #dc6601;
  }
`;
const DrawerContent = styled(Drawer)(({ theme }) => ({
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: 240,
    boxSizing: "border-box",
    [theme.breakpoints.up('sm')]: {
      marginTop: 95,
      paddingRight: 25, // Shift drawer 10px from the top on tablet devices and larger
    },
    [theme.breakpoints.down('xs')]: {
      marginTop: 0, // No shift on mobile devices
    },
    backdropFilter: 'blur(10px)', // Add this line for background blur
    boxShadow: 'none', // Ensure no shadow is applied
  },
}));
const MainContent = styled("div")(({ theme, sidebarOpen }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: 'margin 0.3s',
  [theme.breakpoints.up('sm')]: {
    marginRight: sidebarOpen ? 220 : 0, // Apply margin adjustment on larger screens
  },
  [theme.breakpoints.down('xs')]: {
    marginRight: 0, // No margin adjustment on mobile screens
  },
}));
const NoItemsFound = styled(Typography)({
  textAlign: "center",
  marginTop: "20px",
  color: "rgb(66, 6, 68)",
});
// * const PaginationContainer = styled(Grid)(({ theme }) => ({
//   marginTop: theme.spacing(3),
//   display: 'flex',
//   justifyContent: 'center',
// }));
const ProductImage = styled("img")({
  width: "100%",
  height: "auto",
  marginBottom: "10px",
});
// const DrawerHeader = styled('div')(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   padding: theme.spacing(0, 1),
//   // necessary for content to be below app bar
//   ...theme.mixins.toolbar,
//   justifyContent: 'flex-end',
// }));

const AllProductsPage = () => {
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSortAscending, setIsSortAscending] = useState(true);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCompany, setSelectedCompany] = useState("All");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  //TODO advanced search
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Name");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCategories();
    fetchCompanies();
    // fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [
    products,
    selectedCategory,
    selectedCompany,
    selectedRating,
    minPrice,
    maxPrice,
    selectedAvailability,
    sortBy,
    isSortAscending,
    searchTerm,
    page,
  ]);

  // const fetchProducts = () => {
  //   axios
  //     .get(`${API_BASE_URL}/products`)
  //     .then((response) => {
  //       setProducts(response.data);
  //       setTotalPages(Math.ceil(response.data.length / 10));
  //     })
  //     .catch((error) => console.error("Error fetching products:", error));
  // };

  const fetchCategories = () => {
    axios
      .get(`${API_BASE_URL}/categories`)
      .then((response) => {
        const categoryNames = response.data.map((category) => category.name);
        setCategories(["All", ...categoryNames]);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  };

  const fetchCompanies = () => {
    axios
      .get(`${API_BASE_URL}/companies`)
      .then((response) => {
        const companyNames = response.data.map((company) => company.name);
        setCompanies(["All", ...companyNames]);
      })
      .catch((error) => console.error("Error fetching companies:", error));
  };

  const filterProducts = () => {
    let url = `${API_BASE_URL}/filterProducts`;
    const params = {
      selectedCategory,
      selectedCompany,
      selectedRating,
      minPrice,
      maxPrice,
      selectedAvailability,
      sortBy,
      isSortAscending,
      searchTerm,
      page,
    };

    axios
      .get(url, { params })
      .then((response) => {
        // TODO shift pagination in backend
        const startIndex = (page - 1) * 10;
        const endIndex = startIndex + 10;
        setTotalPages(Math.ceil(response.data.length / 10));
        const filteredProducts = response.data.slice(startIndex, endIndex);
        setFilteredProducts(filteredProducts);
      })
      .catch((error) => console.error("Error filtering products:", error));
  };

  // ! Value changes and page resets
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const openProductDialog = (product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
    // console.log(`/products/${product.id}`)
    // const navigate = useNavigate()
    // navigate.push(`/products/${product.id}`);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setPage(1);
  };

  const handleCompanyChange = (event) => {
    setSelectedCompany(event.target.value);
    setPage(1);
  };

  const handleRatingChange = (event) => {
    setSelectedRating(event.target.value);
    setPage(1);
  };

  const handleMinPriceChange = (event) => {
    setMinPrice(event.target.value);
    setPage(1);
  };

  const handleMaxPriceChange = (event) => {
    setMaxPrice(event.target.value);
    setPage(1);
  };

  const handleAvailabilityChange = (event) => {
    setSelectedAvailability(event.target.value);
    setPage(1);
  };

  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
    setPage(1);
  };

  const toggleSortDirection = () => {
    setIsSortAscending((prev) => !prev);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const closeProductDialog = () => {
    setSelectedProduct(null);
    setOpenDialog(false);
  };

  return (
    <Container
      sx={{
        maxWidth: '100% !important' ,
        // backgroundColor: '#e29267'
        minHeight: "100vh",
      }}
    >
      {/* Navbar */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#dc6601",
          width: "100%",
          borderRadius: "20px",
          border: "2px solid #dc6601",
        }}
      >
        <Toolbar
          sx={{
            backgroundColor: "#dc6601",
            width: "100%",
            borderRadius: "20px",
            borderWidth: "10px",
          }}
        >
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, mr: 2 }}>
            CCanvas
          </Typography>
          {/* Search-Bar */}
          <CustomBorderTextField2
            // variant="outlined"
            label="Search Products"
            value={searchTerm}
            onChange={handleSearchChange}
            fullWidth
            margin="dense"
            sx={{
              backgroundColor: "white",
              borderRadius: "5px",
              color: "transparent",
            }}
          />
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ 
              ml: 2, 
              color:'#dc6601', 
              backgroundColor:'white', 
              borderRadius:'5px',
              '&:hover': { 
                backgroundColor: 'white', 
                color:'#dc6601', 
                borderRadius:'10px' }, 
              }}
            onClick={toggleSidebar}
          >
            {sidebarOpen ? '' : 'Filter'}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Components */}
      <Grid container spacing={3}>
        {/* Sidebar Drawer */}
        <DrawerContent 
          // variant=""
          anchor="right" 
          open={sidebarOpen} 
          onClose={toggleSidebar} 
          sx={{ width : 240}}
          BackdropProps={{ invisible: true }}
        >
          {/* items */}
          <List 
            sx={{ 
              backgroundColor: "transparent", 
              height: "100vw" 
              }}
          >
            {/* Filters */}
            <ListItem>
              <ListItemText  primary="" />
            </ListItem>
            {/* Category */}
            <ListItem>
              <CustomBorderFormControl
                variant="outlined"
                fullWidth
                margin="dense"
              >
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  label="Category"
                >
                  {categories.map((category, index) => (
                    <MenuItem key={index} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </CustomBorderFormControl>
            </ListItem>
            {/* Company */}
            <ListItem>
              <CustomBorderFormControl
                variant="outlined"
                fullWidth
                margin="dense"
              >
                <InputLabel id="company-label">Company</InputLabel>
                <Select
                  labelId="company-label"
                  value={selectedCompany}
                  onChange={handleCompanyChange}
                  label="Company"
                >
                  {companies.map((company, index) => (
                    <MenuItem key={index} value={company}>
                      {company}
                    </MenuItem>
                  ))}
                </Select>
              </CustomBorderFormControl>
            </ListItem>
            {/* Rating */}
            <ListItem>
              <CustomBorderFormControl
                variant="outlined"
                fullWidth
                margin="dense"
              >
                <InputLabel id="rating-label">Rating</InputLabel>
                <Select
                  labelId="rating-label"
                  value={selectedRating}
                  onChange={handleRatingChange}
                  label="Rating"
                >
                  <MenuItem value="">Any</MenuItem>
                  {[...Array(5).keys(), 4.5].map((rating) => (
                    <MenuItem key={rating} value={rating}>
                      {rating}+
                    </MenuItem>
                  ))}
                </Select>
              </CustomBorderFormControl>
            </ListItem>
            {/* Pricing */} 
            <ListItem>
              {/* MinPrice */}
                <CustomBorderTextField
                  variant="outlined"
                  label="Min Price"
                  value={minPrice}
                  onChange={handleMinPriceChange}
                  fullWidth
                  margin="dense"
                  type="number"
                />
              {/* MaxPrice */}
                <CustomBorderTextField
                  variant="outlined"
                  label="Max Price"
                  value={maxPrice}
                  onChange={handleMaxPriceChange}
                  fullWidth
                  margin="dense"
                  type="number"
                />
            </ListItem>
            {/* Availability */}
            <ListItem>
              <CustomBorderFormControl
                variant="outlined"
                fullWidth
                margin="dense"
              >
                <InputLabel id="availability-label">Availability</InputLabel>
                <Select
                  labelId="availability-label"
                  value={selectedAvailability}
                  onChange={handleAvailabilityChange}
                  label="Availability"
                >
                  <MenuItem value="">Any</MenuItem>
                  {["yes", "no"].map((availability, index) => (
                    <MenuItem key={index} value={availability}>
                      {availability}
                    </MenuItem>
                  ))}
                </Select>
              </CustomBorderFormControl>
            </ListItem>
            {/* Sorting */}
            <ListItem>
              <CustomBorderFormControl
                variant="outlined"
                fullWidth
                margin="dense"
              >
                <InputLabel id="sort-by-label">Sort By</InputLabel>
                <Select
                  labelId="sort-by-label"
                  value={sortBy}
                  onChange={handleSortByChange}
                  label="Sort By"
                >
                  {["Name", "Price", "Discount", "Rating"].map(
                    (option, index) => (
                      <MenuItem key={index} value={option}>
                        {option}
                      </MenuItem>
                    )
                  )}
                </Select>
              </CustomBorderFormControl>
              <Tooltip
                title={`Toggle ${isSortAscending ? "Descending" : "Ascending"}`}
              >
                <IconButton onClick={toggleSortDirection}>
                  {isSortAscending ? <ArrowDownward /> : <ArrowUpward />}
                </IconButton>
              </Tooltip>
            </ListItem>
          </List>
        </DrawerContent>
        {/* Product List */}
        <Grid item xs={12}>
          <MainContent sidebarOpen={sidebarOpen}>
            {filteredProducts.length > 0 ? (
              <Grid container spacing={3}>
                {filteredProducts.map((product, index) => (
                  <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                    <Card>
                      <ProductImage
                        src={product.imageUrl || DummyIMG}
                        alt={product.productName}
                      />
                      <CardContent
                        sx={{
                          color:
                            product.availability === "no"
                              ? "lightgray"
                              : "inherit",
                        }}
                      >
                        {/* Product Name */}
                        <Typography
                          variant="h4"
                          style={{
                            color: "#17252a",
                            fontWeight: "",
                            fontFamily: "",
                          }}
                        >
                          {product.productName}
                        </Typography>
                        {/* Category (Small Text) */}
                        <Typography
                          variant="body2"
                          style={{
                            fontSize: "0.8rem",
                            marginTop: "5px",
                            color:
                              product.availability === "no"
                                ? "lightgray"
                                : "grey",
                          }}
                        >
                          {/* Category: */}
                          {product.category}
                        </Typography>
                        {/* Company */}
                        <Typography variant="subtitle1">
                          Company: {product.company}
                        </Typography>
                        {/* Price (Cross if Discounted) */}
                        <Typography variant="subtitle1">
                          Price: $
                          {(
                            product.price -
                            (product.price * product.discount) / 100
                          ).toFixed(2)}{" "}
                          {product.discount > 0 && (
                            <del
                              style={{
                                color:
                                  product.availability === "no"
                                    ? "lightgray"
                                    : "grey",
                                marginLeft: "5px",
                              }}
                            >
                              ${product.price}
                            </del>
                          )}
                        </Typography>
                        {/* Rating (Star Format) */}
                        <Typography variant="subtitle1">
                          Rating:{" "}
                          {Array.from(Array(Math.round(product.rating))).map(
                            (_, index) => (
                              <Star
                                key={index}
                                style={{
                                  color:
                                    product.availability === "no"
                                      ? "lightgray"
                                      : "#fdd835",
                                  fontSize: "1rem",
                                  marginBottom: "-3px",
                                }}
                              />
                            )
                          )}
                        </Typography>
                        {/* Button to open the dialogue */}
                        <Button
                          onClick={() => openProductDialog(product)}
                          variant="contained"
                          color="primary"
                          sx={{
                            marginTop: 2,
                            borderRadius: "20px",
                            backgroundColor: "#f4730b",
                            "&:hover": { backgroundColor: "#f96209" },
                          }}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <NoItemsFound variant="body1">No items found.</NoItemsFound>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <CustomPaginationContainer>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  showFirstButton
                  showLastButton
                />
              </CustomPaginationContainer>
            )}
          </MainContent>
        </Grid>
      </Grid>

      {/* Product Details Dialog --- Pop-up */}
      <Dialog open={openDialog} onClose={closeProductDialog}>
        <Card
              sx={{
                maxWidth: { xs: '100%', sm: 345 },
                margin: '20px auto',
                boxShadow: 3,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <CardHeader
                title={selectedProduct?.productName}
                titleTypographyProps={{ variant: 'h6', color: 'white' }}
                sx={{ backgroundColor: '#f96209', textAlign: 'center' }}
              />
              <Box
                sx={{
                  overflowY: 'auto',
                  maxHeight: 400,
                  '&::-webkit-scrollbar': { width: '0.4em' },
                  '&::-webkit-scrollbar-thumb': { backgroundColor: '#f96209' },
                }}
              >
                <CardMedia
                  component="img"
                  height="194"
                  image={selectedProduct?.imageUrl || DummyIMG}
                  alt={selectedProduct?.productName}
                  sx={{ padding: '10px', objectFit: 'contain' }}
                />
                <CardContent>
                  <Typography variant="body1">
                    <span style={{ color: "#f96209" }}>{selectedProduct?.category}</span> 
                    from 
                    <span style={{ color: "#f96209" }}>{selectedProduct?.company}</span>
                  </Typography>
                  <Typography variant="body1" sx={{ marginTop: '8px' }}>
                    <span style={{ color: "#f96209" }}>Price: </span>$
                    {(
                      selectedProduct?.price -
                      (selectedProduct?.price * selectedProduct?.discount) / 100
                    ).toFixed(2)}{" "}
                    {selectedProduct?.discount > 0 && (
                      <del style={{ color: selectedProduct?.availability === "no" ? "lightgray" : "grey", marginLeft: "5px" }}>
                        ${selectedProduct?.price}
                      </del>
                    )}
                  </Typography>
                  <Typography variant="body1" sx={{ marginTop: '8px' }}>
                    <span style={{ color: "#f96209" }}>Rating:</span> {selectedProduct?.rating}
                  </Typography>
                  <Typography variant="body1" sx={{ marginTop: '8px' }}>
                    <span style={{ color: "#f96209" }}>Discount:</span> {selectedProduct?.discount}%
                  </Typography>
                  {selectedProduct?.availability === "no" && (
                    <Typography variant="body1" color="error" sx={{ marginTop: '8px' }}>
                      Product is currently not available
                    </Typography>
                  )}
                </CardContent>
              </Box>
              <CardActions sx={{ justifyContent: 'center', borderTop: '1px solid #f96209', backgroundColor:'#f96209' }}>
                <Button onClick={closeProductDialog} sx={{ color: "white" }}>
                  Close
                </Button>
              </CardActions>
            </Card>
      </Dialog>
    </Container>
  );
};

export default AllProductsPage;
