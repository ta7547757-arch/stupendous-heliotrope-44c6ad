/* =========================
   CART PAGE
========================= */

const cartItems =
    document.querySelector(".cart-items");

if (cartItems) {

    let cart =
        JSON.parse(
            localStorage.getItem("bintaahCart")
        ) || [];


    const subtotalElement =
        document.querySelectorAll(
            ".summary-row strong"
        )[0];

    const deliveryElement =
        document.querySelectorAll(
            ".summary-row strong"
        )[1];

    const totalElement =
        document.querySelector(
            ".summary-total strong"
        );


    function displayCart() {

        if (cart.length === 0) {

            cartItems.innerHTML =
                '<p class="empty-cart">Your cart is currently empty.</p>';

            if (subtotalElement)
                subtotalElement.textContent = "৳ 0";

            if (deliveryElement)
                deliveryElement.textContent = "৳ 0";

            if (totalElement)
                totalElement.textContent = "৳ 0";

            return;
        }


        cartItems.innerHTML = "";

        let subtotal = 0;


        cart.forEach(function(product, index) {

            const price =
                Number(product.price) || 0;

            const quantity =
                Number(product.quantity) || 1;

            subtotal +=
                price * quantity;


            const item =
                document.createElement("div");

            item.className =
                "cart-item";


            item.innerHTML = `

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                <div class="cart-item-info">

                    <h3>
                        ${product.name}
                    </h3>

                    <p>
                        Size: ${product.size || ""}
                    </p>

                    <p>
                        Price: ৳ ${price}
                    </p>

                    <div class="cart-quantity">

                        <button
                            onclick="decreaseQuantity(${index})">
                            −
                        </button>

                        <span>
                            ${quantity}
                        </span>

                        <button
                            onclick="increaseQuantity(${index})">
                            +
                        </button>

                    </div>

                    <button
                        class="remove-cart-item"
                        onclick="removeItem(${index})">

                        REMOVE

                    </button>

                </div>

            `;


            cartItems.appendChild(item);

        });


        if (subtotalElement)
            subtotalElement.textContent =
                "৳ " + subtotal;

        if (deliveryElement)
            deliveryElement.textContent =
                "৳ 0";

        if (totalElement)
            totalElement.textContent =
                "৳ " + subtotal;

    }


    window.increaseQuantity =
        function(index) {

            if (!cart[index]) return;

            cart[index].quantity =
                (Number(cart[index].quantity) || 1) + 1;

            localStorage.setItem(
                "bintaahCart",
                JSON.stringify(cart)
            );

            displayCart();

        };


    window.decreaseQuantity =
        function(index) {

            if (!cart[index]) return;

            const currentQuantity =
                Number(cart[index].quantity) || 1;

            if (currentQuantity > 1) {

                cart[index].quantity =
                    currentQuantity - 1;

            }

            localStorage.setItem(
                "bintaahCart",
                JSON.stringify(cart)
            );

            displayCart();

        };


    window.removeItem =
        function(index) {

            if (!cart[index]) return;

            cart.splice(index, 1);

            localStorage.setItem(
                "bintaahCart",
                JSON.stringify(cart)
            );

            displayCart();

        };


    displayCart();

}

/* =========================
   CHECKOUT PAGE
========================= */

const checkoutItems =
    document.getElementById("checkoutItems");

if (checkoutItems) {

    /* =========================
       GET CART
    ========================= */

    let checkoutCart =
        JSON.parse(
            localStorage.getItem("bintaahCart")
        ) || [];


    /* =========================
       GET BUY NOW
    ========================= */

    const buyNowProduct =
        JSON.parse(
            localStorage.getItem("bintaahBuyNow")
        );


    /* =========================
       IF BUY NOW EXISTS
       USE ONLY BUY NOW PRODUCT
    ========================= */

    if (buyNowProduct) {

        checkoutCart = [
            buyNowProduct
        ];

    }


    const subtotalElement =
        document.getElementById(
            "checkoutSubtotal"
        );

    const deliveryElement =
        document.getElementById(
            "checkoutDelivery"
        );

    const totalElement =
        document.getElementById(
            "checkoutTotal"
        );

    const deliveryArea =
        document.getElementById(
            "deliveryArea"
        );


    let subtotal = 0;


    /* =========================
       DISPLAY CHECKOUT
    ========================= */

    function displayCheckout() {

        if (checkoutCart.length === 0) {

            checkoutItems.innerHTML =
                '<p class="empty-cart">Your cart is empty.</p>';

            subtotalElement.textContent =
                "৳ 0";

            deliveryElement.textContent =
                "৳ 0";

            totalElement.textContent =
                "৳ 0";

            return;

        }


        checkoutItems.innerHTML = "";

        subtotal = 0;


        checkoutCart.forEach(
            function(product) {

                const price =
                    Number(product.price) || 0;

                const quantity =
                    Number(product.quantity) || 1;


                subtotal +=
                    price * quantity;


                const item =
                    document.createElement("div");


                item.className =
                    "checkout-item";


                item.innerHTML = `

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                    <div class="checkout-item-info">

                        <h3>
                            ${product.name}
                        </h3>

                        <p>
                            Size:
                            ${product.size || ""}
                        </p>

                        <p>
                            Quantity:
                            ${quantity}
                        </p>

                        <p>
                            ৳ ${price * quantity}
                        </p>

                    </div>

                `;


                checkoutItems.appendChild(item);

            }
        );


        updateCheckoutTotal();

    }


    /* =========================
       UPDATE TOTAL
    ========================= */

    function updateCheckoutTotal() {

        let delivery = 0;


        if (
            deliveryArea &&
            deliveryArea.value === "inside"
        ) {

            delivery = 60;

        }


        if (
            deliveryArea &&
            deliveryArea.value === "outside"
        ) {

            delivery = 120;

        }


        const total =
            subtotal + delivery;


        subtotalElement.textContent =
            "৳ " + subtotal;

        deliveryElement.textContent =
            "৳ " + delivery;

        totalElement.textContent =
            "৳ " + total;

    }


    if (deliveryArea) {

        deliveryArea.addEventListener(
            "change",
            updateCheckoutTotal
        );

    }


    displayCheckout();



    /* =========================
       PLACE ORDER
    ========================= */

    const checkoutForm =
        document.getElementById(
            "checkoutForm"
        );


    if (checkoutForm) {

        checkoutForm.addEventListener(
            "submit",
            async function(event) {

                event.preventDefault();


                if (checkoutCart.length === 0) {

                    alert(
                        "Your cart is empty."
                    );

                    return;

                }


                /* =========================
                   CUSTOMER EMAIL
                ========================= */

                let customerEmail = "";


                if (
                    typeof supabaseClient !==
                    "undefined"
                ) {

                    try {

                        const {
                            data: userData
                        } =
                            await supabaseClient
                            .auth
                            .getUser();


                        if (
                            userData &&
                            userData.user
                        ) {

                            customerEmail =
                                userData.user.email || "";

                        }

                    } catch (error) {

                        console.log(
                            "Guest checkout"
                        );

                    }

                }

let customerUserId = null;

if (typeof supabaseClient !== "undefined") {
    try {
        const { data: userData } =
            await supabaseClient.auth.getUser();

        if (userData && userData.user) {
            customerUserId = userData.user.id;
        }

    } catch (error) {
        console.log("Guest checkout");
    }
}
                /* =========================
                   CUSTOMER INFORMATION
                ========================= */

                const name =
                    document
                    .getElementById(
                        "customerName"
                    )
                    .value
                    .trim();


                const phone =
                    document
                    .getElementById(
                        "customerPhone"
                    )
                    .value
                    .trim();


                const address =
                    document
                    .getElementById(
                        "customerAddress"
                    )
                    .value
                    .trim();


                const area =
                    document
                    .getElementById(
                        "deliveryArea"
                    )
                    .value;


                if (area === "") {

                    alert(
                        "Please select your delivery area."
                    );

                    return;

                }


                /* =========================
                   DELIVERY CHARGE
                ========================= */

                let delivery = 0;


                if (area === "inside") {

                    delivery = 60;

                }


                if (area === "outside") {

                    delivery = 120;

                }


                /* =========================
                   SUBTOTAL
                ========================= */

                let orderSubtotal = 0;


                checkoutCart.forEach(
                    function(product) {

                        orderSubtotal +=
                            (Number(product.price) || 0) *
                            (Number(product.quantity) || 1);

                    }
                );


                const orderTotal =
                    orderSubtotal +
                    delivery;


                /* =========================
                   ORDER ID
                ========================= */

                const orderId =
                    "BT" + Date.now();


                /* =========================
                   TRACKING TOKEN
                ========================= */

                const trackingToken =
                    crypto.randomUUID();


                /* =========================
                   SAVE TO SUPABASE
                ========================= */

                if (
                    typeof supabaseClient ===
                    "undefined"
                ) {

                    alert(
                        "Supabase connection not found."
                    );

                    return;

                }


                const {
                    data,
                    error
                } =
                    await supabaseClient
                    .from("orders")
                    .insert([
                        {




                            order_id:
                                orderId,

                            tracking_token:
                                trackingToken,

                            customer_name:
                                name,

                            customer_email:
                                customerEmail,

user_id:
    customerUserId,

                            phone:
                                phone,

                            address:
                                address,

                            delivery_area:
                                area,

                            payment_method:
                                "Cash on Delivery",

                            products:
                                checkoutCart,

                            subtotal:
                                orderSubtotal,

                            delivery_charge:
                                delivery,

                            total:
                                orderTotal,

                            status:
                                "New"

                        }
                    ])
                    .select();


               if (error) {

    console.error("ORDER ERROR MESSAGE:", error.message);
    console.error("ORDER ERROR CODE:", error.code);
    console.error("ORDER ERROR DETAILS:", error.details);
    console.error("ORDER ERROR HINT:", error.hint);

    alert(
        "Order could not be placed. Please try again."
    );

    return;

}


                /* =========================
                   SAVE LAST ORDER
                ========================= */

                const order = {

                    orderId:
                        orderId,

                    trackingToken:
                        trackingToken,

                    customerName:
                        name,

                    phone:
                        phone,

                    address:
                        address,

                    area:
                        area,

                    payment:
                        "Cash on Delivery",

                    products:
                        checkoutCart,

                    subtotal:
                        orderSubtotal,

                    delivery:
                        delivery,

                    total:
                        orderTotal,

                    date:
                        new Date()
                        .toLocaleString()

                };


                localStorage.setItem(
                    "bintaahLastOrder",
                    JSON.stringify(order)
                );


                /* =========================
                   CLEAR CART
                ========================= */

                localStorage.removeItem(
                    "bintaahCart"
                );


                /* =========================
                   CLEAR BUY NOW
                ========================= */

                localStorage.removeItem(
                    "bintaahBuyNow"
                );


                /* =========================
                   GO TO SUCCESS
                ========================= */

                window.location.href =
                    "order-success.html";

            }
        );

    }

}


/* =========================
   ORDER SUCCESS PAGE
========================= */

const orderDetails =
    document.getElementById(
        "orderDetails"
    );


if (orderDetails) {

    const order =
        JSON.parse(
            localStorage.getItem(
                "bintaahLastOrder"
            )
        );


    if (!order) {

        orderDetails.innerHTML =
            '<p style="text-align:center;color:#777;">No recent order found.</p>';

    }

    else {

        let productsHTML = "";


        if (
            order.products &&
            Array.isArray(order.products)
        ) {

            order.products.forEach(
                function(product) {

                    const price =
                        Number(product.price) || 0;

                    const quantity =
                        Number(product.quantity) || 1;


                    productsHTML += `

                        <div class="order-product">

                            <img
                                src="${product.image}"
                                alt="${product.name}"
                            >

                            <div class="order-product-info">

                                <h3>
                                    ${product.name}
                                </h3>

                                <p>
                                    Size:
                                    ${product.size || ""}
                                </p>

                                <p>
                                    Quantity:
                                    ${quantity}
                                </p>

                                <p>
                                    Price:
                                    ৳ ${price * quantity}
                                </p>

                            </div>

                        </div>

                    `;

                }
            );

        }



        const areaText =
            order.area === "inside"
                ? "Inside Dhaka"
                : "Outside Dhaka";



        orderDetails.innerHTML = `

            <div class="order-detail-row">

                <span>
                    Order ID
                </span>

                <strong>
                    ${order.orderId}
                </strong>

            </div>


            <div class="order-detail-row">

                <span>
                    Customer
                </span>

                <strong>
                    ${order.customerName}
                </strong>

            </div>


            <div class="order-detail-row">

                <span>
                    Phone
                </span>

                <strong>
                    ${order.phone}
                </strong>

            </div>


            <div class="order-detail-row">

                <span>
                    Delivery Area
                </span>

                <strong>
                    ${areaText}
                </strong>

            </div>


            <div class="order-detail-row">

                <span>
                    Address
                </span>

                <strong>
                    ${order.address}
                </strong>

            </div>


            <div class="order-detail-row">

                <span>
                    Payment
                </span>

                <strong>
                    Cash on Delivery
                </strong>

            </div>


            <div class="order-products">

                ${productsHTML}

            </div>


            <div class="order-detail-row">

                <span>
                    Subtotal
                </span>

                <strong>
                    ৳ ${order.subtotal}
                </strong>

            </div>


            <div class="order-detail-row">

                <span>
                    Delivery
                </span>

                <strong>
                    ৳ ${order.delivery}
                </strong>

            </div>


            <div class="order-total">

                <span>
                    Total
                </span>

                <strong>
                    ৳ ${order.total}
                </strong>

            </div>

        `;

    }

}

/* =========================
   HOME FEATURED PRODUCTS
========================= */

const featuredProducts =
    document.getElementById("featuredProducts");

if (featuredProducts && typeof products !== "undefined") {

    const featuredIds = [1, 2, 3, 4];

    const selectedProducts =
        products.filter(product =>
            featuredIds.includes(product.id)
        );

    featuredProducts.innerHTML = "";

    selectedProducts.forEach(function(product) {

        const card =
            document.createElement("div");

        card.className = "featured-card";

        card.innerHTML = `

            <a href="product.html?id=${product.id}">
                <img
                    src="${product.mainImage}"
                    alt="${product.name}"
                >
            </a>

            <div class="featured-info">

                <h3>${product.name}</h3>

                <p>৳ ${product.price.toLocaleString()}</p>

<div class="featured-buttons">

   <button
    type="button"
    class="featured-cart-btn"
    onclick="goToProduct(${product.id}, 'cart')"
>
    ADD TO CART
</button>

<button
    type="button"
    class="featured-buy-btn"
    onclick="goToProduct(${product.id}, 'buy')"
>
    BUY NOW
</button>

</div>
            </div>

        `;

        featuredProducts.appendChild(card);

    });

}


/* =========================
   FEATURED / GLOBAL CART FUNCTIONS
========================= */


/* =========================
   ADD TO CART
========================= */

window.addToCart = function(productId) {

    const product =
        products.find(function(item) {
            return item.id === Number(productId);
        });

    if (!product) {

        alert("Product not found.");

        return;
    }


    let cart =
        JSON.parse(
            localStorage.getItem("bintaahCart")
        ) || [];


    /* Check if product already exists */

    const existingProduct =
        cart.find(function(item) {

            return item.id === product.id;

        });


    if (existingProduct) {

        existingProduct.quantity =
            (Number(existingProduct.quantity) || 1) + 1;

    }

    else {

        cart.push({

            id:
                product.id,

            name:
                product.name,

            price:
                product.price,

            image:
                product.mainImage,

            size:
                "",

            quantity:
                1

        });

    }


    localStorage.setItem(
        "bintaahCart",
        JSON.stringify(cart)
    );


    alert(
        product.name + " added to cart."
    );

};



/* =========================
   BUY NOW
========================= */

window.buyNow = function(productId) {

    const product =
        products.find(function(item) {
            return item.id === Number(productId);
        });


    if (!product) {

        alert("Product not found.");

        return;
    }


    const buyNowProduct = {

        id:
            product.id,

        name:
            product.name,

        price:
            product.price,

        image:
            product.mainImage,

        size:
            "",

        quantity:
            1

    };


    /* Save Buy Now product */

    localStorage.setItem(
        "bintaahBuyNow",
        JSON.stringify(buyNowProduct)
    );


  

};
/* =========================
   FEATURED → PRODUCT PAGE
========================= */

window.goToProduct = function(productId, action) {

    window.location.href =
        "product.html?id=" +
        productId +
        "&action=" +
        action;

};



const newsletterForm = document.getElementById("newsletterForm");
const newsletterMessage = document.getElementById("newsletterMessage");

if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
        e.preventDefault();

        newsletterMessage.textContent =
            "Thank you for your interest in Bintaah!";

        newsletterForm.reset();
    });
}

