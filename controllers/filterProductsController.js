const axios = require('axios');
const API_BASE_URL = 'https://json-server.bytexl.app';

// exports.getProducts = async (req, res) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/products`);
//     res.json(response.data);
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     res.status(500).json({ error: 'Error fetching products' });
//   }
// };

exports.filterProducts = async (req, res) => {
  try {
    const {
      selectedCategory,
      selectedCompany,
      selectedRating,
      minPrice,
      maxPrice,
      selectedAvailability,
      sortBy,
      isSortAscending,
      searchTerm,
    } = req.query;

    
    let url = `${API_BASE_URL}/products`;
    const queryParams = [];

    if (selectedCategory !== 'All') {
        // ! _ -> %
        url = `${API_BASE_URL}/categories/${encodeURIComponent(selectedCategory)}/products`;    
    }
    if (selectedCompany !== 'All') {
        url = `${API_BASE_URL}/companies/${encodeURIComponent(selectedCompany)}/products`;
    }
    if (selectedCategory !== 'All' && selectedCompany !== 'All') {
        url = `${API_BASE_URL}/companies/${encodeURIComponent(selectedCompany)}/categories/${encodeURIComponent(selectedCategory)}/products`;
    }


    if (minPrice) {
        let NumberMinPrice = Number(minPrice)
      queryParams.push(`minPrice=${encodeURIComponent(NumberMinPrice)}`);
    }
    if (maxPrice) {
        let NumberMinPrice = Number(maxPrice)
      queryParams.push(`maxPrice=${encodeURIComponent(NumberMinPrice)}`);
    }
    if (selectedAvailability) {
        queryParams.push(
            `availability=${encodeURIComponent(
              selectedAvailability === "yes" ? "yes" : "no"
            )}`
        );
    }
    if ((selectedCategory !== 'All' || selectedCompany !== 'All') && !searchTerm.trim()) {
        queryParams.push(`top=${encodeURIComponent(1000)}`); // Change 10 to your desired number
    }

    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }

    const response = await axios.get(url);
    let filteredProducts = response.data;

    // console.log(sortBy)
    // console.log(isSortAscending)
    // isSortAscending = Boolean(isSortAscending);
    const isSortAscendingBoolean = isSortAscending === 'true';
    if (sortBy) {
        switch (sortBy) {
          case "Name":
            filteredProducts.sort((a, b) => {
              const nameA = a.productName.toLowerCase();
              const nameB = b.productName.toLowerCase();

              const splitByDigit = (str) => {
                // ! Split at every digit occurance -> remove empty -> if number > base 10 --> if not number > lowecase
                return str
                  .split(/(\d+)/)
                  .filter(Boolean)
                  .map((part) =>
                    isNaN(part) ? part.toLowerCase() : parseInt(part, 10)
                  );
              };

              const naturalCompare = (partsA, partsB) => {
                const minLength = Math.min(partsA.length, partsB.length);
                for (let i = 0; i < minLength; i++) {
                  const partA = partsA[i];
                  const partB = partsB[i];

                  if (typeof partA === "string" && typeof partB === "string") {
                    // ! Compare alphabetically
                    const compareResult = partA.localeCompare(partB);
                  if (compareResult !== 0) {
                      return compareResult;
                  }
                  } else if (typeof partA === "number" && typeof partB === "number") {
                  // ! Compare numerically
                  if (partA !== partB) {
                    return partA - partB;
                  }
                  } else {
                    // ! Type mismatch, prioritize string over number
                    return typeof partA === "string" ? -1 : 1;
                  }
                }
                // ! If all parts are identical up to minLength, shorter string comes first
                return partsA.length - partsB.length;
              };
              // ! Split product names into parts of digits and non-digits
              const partsA = splitByDigit(nameA);
              const partsB = splitByDigit(nameB);

            // ! Toggle sorting direction
                //   console.log("reversing")
                //   console.log(isSortAscending)
                //   console.log("true" === isSortAscending)
              const result = isSortAscendingBoolean ? naturalCompare(partsA, partsB) : naturalCompare(partsB, partsA); 
              return result;
            });
            break;

          case "Price":
            // ! filtered.sort((a, b) => (isSortAscending ? a.price - b.price : b.price - a.price));
            filteredProducts.sort((a, b) => {
              const effectivePriceA = a.price - (a.price * a.discount) / 100;
              const effectivePriceB = b.price - (b.price * b.discount) / 100;
              return isSortAscendingBoolean
                ? effectivePriceA - effectivePriceB
                : effectivePriceB - effectivePriceA;
            });
            break;

          case "Discount":
            filteredProducts.sort((a, b) =>
                isSortAscendingBoolean
                ? a.discount - b.discount
                : b.discount - a.discount
            );
            break;

          case "Rating":
            filteredProducts.sort((a, b) =>
                isSortAscendingBoolean ? a.rating - b.rating : b.rating - a.rating
            );
            break;

          default:
            break;
        }
    }
        // ! rating filter
        if (selectedRating !== "") {
          filteredProducts = filteredProducts.filter(
            (product) => product.rating >= parseFloat(selectedRating)
          );
        }
        // ! search filter
        if (searchTerm.trim() !== "") {
          filteredProducts = filteredProducts.filter((product) =>
            product.productName.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

    res.json(filteredProducts);
  } catch (error) {
    console.error('Error filtering products:', error);
    res.status(500).json({ error: 'Error filtering products' });
  }
};
