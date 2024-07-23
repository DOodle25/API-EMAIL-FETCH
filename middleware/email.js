const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    auth: {
        user: "emailhelper468@gmail.com",
        pass: "jadf dtgc uths mhqt",
    },
});

let emailTimer; // Timer variable for debouncing

const emailmiddleware = async (req, res, next) => {
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
            page
        } = req.query;

        const emailContent = `
            <p>Filter details:</p>
            <ul>
                <li>Category: ${selectedCategory || 'N/A'}</li>
                <li>Company: ${selectedCompany || 'N/A'}</li>
                <li>Rating: ${selectedRating || 'N/A'}</li>
                <li>Price Range: ${minPrice || 'N/A'} - ${maxPrice || 'N/A'}</li>
                <li>Availability: ${selectedAvailability || 'N/A'}</li>
                <li>Sort By: ${sortBy || 'N/A'}</li>
                <li>Sort Order: ${isSortAscending ? 'Ascending' : 'Descending'}</li>
                <li>Search Term: ${searchTerm || 'N/A'}</li>
                <li>Page: ${page || 'N/A'}</li>
            </ul>
            <br><br>Thank you<br>emailhelper468@gmail.com
        `;

        // Clear the existing timer
        clearTimeout(emailTimer);

        // Set a new timer
        emailTimer = setTimeout(async () => {
            try {
                const info = await transporter.sendMail({
                    from: 'emailhelper468@gmail.com',
                    to: 'emailhelper468@gmail.com',
                    subject: 'Filter Details',
                    html: emailContent,
                });

                console.log('Email sent:', info.response);
            } catch (error) {
                console.error('Error sending email:', error);
            }
        }, 10000); // 10 seconds debounce time

        next(); // Call next to proceed to the next middleware or route handler
    } catch (error) {
        console.error('Error in email middleware:', error);
        res.status(400).json({ error: 'Failed to process email middleware' });
    }
};

module.exports = { emailmiddleware };
