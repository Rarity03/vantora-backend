CREATE EXTENSION IF NOT EXISTS vector; 

CREATE TABLE Users ( 
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL, 
    second_name VARCHAR(100), 
    first_lastname VARCHAR(100) NOT NULL, 
    second_lastname VARCHAR(100), 
    date_of_birth DATE, 
    avatar_url VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT now(), 
    updated_at TIMESTAMPTZ DEFAULT now(), 
    is_active BOOLEAN DEFAULT TRUE 
);


CREATE TABLE Categories ( 
    category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE, 
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE Products ( 
    product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_name VARCHAR(255) NOT NULL, 
    description TEXT, 
    tipo VARCHAR(100),
    brand VARCHAR(100), 
    origin_country VARCHAR(100),
    weight_grams INT, 
    is_perishable BOOLEAN DEFAULT FALSE, 
    image_url VARCHAR(255) NOT NULL, 
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now() 
);

CREATE TABLE User_Credentials ( 
    credential_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE, 
    email VARCHAR(255) UNIQUE NOT NULL, 
    password_hash VARCHAR(255) NOT NULL, 
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
); 

CREATE TABLE Access_Tokens ( 
    access_token_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE, 
    token TEXT NOT NULL, 
    is_expired BOOLEAN DEFAULT FALSE, 
    created_at TIMESTAMPTZ DEFAULT now(), 
    was_revoked BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT now()
); 

CREATE TABLE Addresses ( 
    address_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE, 
    street_name VARCHAR(255) NOT NULL, 
    number VARCHAR(50),
    city VARCHAR(100) NOT NULL, 
    state VARCHAR(100) NOT NULL, 
    country VARCHAR(100) NOT NULL, 
    postal_code VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
); 

CREATE TABLE Card (
    card_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
    address_id UUID NOT NULL REFERENCES Addresses(address_id) ON DELETE RESTRICT,
    card_token VARCHAR(255) NOT NULL,
    last_four_digits VARCHAR(4) NOT NULL,
    exp_date VARCHAR(7) NOT NULL, 
    card_type VARCHAR(50),
    card_holder_name VARCHAR(255) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE Product_Categories ( 
    product_id UUID NOT NULL REFERENCES Products(product_id) ON DELETE CASCADE, 
    category_id UUID NOT NULL REFERENCES Categories(category_id) ON DELETE CASCADE, 
    PRIMARY KEY (product_id, category_id) 
);

CREATE TABLE Inventory (
    inventory_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES Products(product_id) ON DELETE CASCADE,
    variant_name VARCHAR(100), 
    variant_value VARCHAR(100), 
    sku VARCHAR(100) UNIQUE, 
    expiration_date DATE, 
    stock INT NOT NULL CHECK (stock >= 0),
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);


CREATE TABLE Tags (
    tag_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE Product_Tags (
    product_id UUID NOT NULL REFERENCES Products(product_id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES Tags(tag_id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, tag_id)
);

CREATE TABLE ProductVectors ( 
    product_id UUID PRIMARY KEY REFERENCES Products(product_id) ON DELETE CASCADE, 
    embedding VECTOR(512) 
); 

CREATE TABLE Favorites ( 
    favorite_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE, 
    product_id UUID NOT NULL REFERENCES Products(product_id) ON DELETE CASCADE, 
    created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id, product_id)
); 

CREATE TABLE Comments ( 
    comment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE, 
    product_id UUID NOT NULL REFERENCES Products(product_id) ON DELETE CASCADE, 
    text TEXT NOT NULL, 
    commented_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE ShoppingCarts ( 
    shopping_cart_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE, 
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now(), 
    updated_at TIMESTAMPTZ DEFAULT now() 
); 

CREATE TABLE ShoppingCart_Products ( 
    shopping_cart_id UUID NOT NULL REFERENCES ShoppingCarts(shopping_cart_id) ON DELETE CASCADE, 
    inventory_id UUID NOT NULL REFERENCES Inventory(inventory_id) ON DELETE CASCADE, 
    quantity INT NOT NULL CHECK (quantity > 0), 
    PRIMARY KEY (shopping_cart_id, inventory_id) 
); 

CREATE TABLE Orders ( 
    order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES Users(user_id) ON DELETE RESTRICT, 
    address_id UUID NOT NULL REFERENCES Addresses(address_id) ON DELETE RESTRICT, 
    card_id UUID NOT NULL REFERENCES Card(card_id) ON DELETE RESTRICT, 
    status VARCHAR(50) DEFAULT 'pending', 
    order_date TIMESTAMPTZ DEFAULT now(), 
    total_price DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
); 

CREATE TABLE OrderItems ( 
    order_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES Orders(order_id) ON DELETE CASCADE, 
    inventory_id UUID NOT NULL REFERENCES Inventory(inventory_id) ON DELETE RESTRICT, 
    quantity INT NOT NULL CHECK (quantity > 0), 
    price_at_purchase DECIMAL(10, 2) NOT NULL 
); 

CREATE TABLE Invoices (
    invoice_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES Orders(order_id) ON DELETE CASCADE,
    rfc VARCHAR(13) NOT NULL, 
    invoice_number VARCHAR(255) NOT NULL UNIQUE,
    subtotal DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'issued',
    social_reason VARCHAR(255),
    fiscal_regime VARCHAR(100),
    postal_code VARCHAR(10),
    pdf_url VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE ShippingMethods (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_access_tokens_user_id ON Access_Tokens(user_id); 
CREATE INDEX idx_addresses_user_id ON Addresses(user_id); 
CREATE INDEX idx_favorites_user_id ON Favorites(user_id); 
CREATE INDEX idx_favorites_product_id ON Favorites(product_id); 
CREATE INDEX idx_comments_user_id ON Comments(user_id); 
CREATE INDEX idx_comments_product_id ON Comments(product_id); 
CREATE INDEX idx_orders_user_id ON Orders(user_id); 
CREATE INDEX idx_orderitems_order_id ON OrderItems(order_id); 
CREATE INDEX idx_productvectors_embedding ON ProductVectors USING hnsw (embedding vector_cosine_ops); 
CREATE INDEX idx_orderitems_inventory_id ON OrderItems(inventory_id); 
CREATE INDEX idx_shoppingcart_products_inventory_id ON ShoppingCart_Products(inventory_id);
CREATE INDEX idx_inventory_product_id ON Inventory(product_id); 
CREATE INDEX idx_card_user_id ON Card(user_id); 
CREATE INDEX idx_card_address_id ON Card(address_id); 
CREATE INDEX idx_orders_address_id ON Orders(address_id); 
CREATE INDEX idx_orders_card_id ON Orders(card_id); 
CREATE INDEX idx_invoices_order_id ON Invoices(order_id); 
CREATE INDEX idx_product_tags_product_id ON Product_Tags(product_id); 
CREATE INDEX idx_product_tags_tag_id ON Product_Tags(tag_id); 

CREATE OR REPLACE FUNCTION trigger_set_timestamp() 
RETURNS TRIGGER AS $$ 
BEGIN 
  NEW.updated_at = NOW(); 
  RETURN NEW; 
END; 
$$ LANGUAGE plpgsql; 

CREATE TRIGGER set_timestamp_users BEFORE UPDATE ON Users FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp(); 
CREATE TRIGGER set_timestamp_products BEFORE UPDATE ON Products FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp(); 
CREATE TRIGGER set_timestamp_shoppingcarts BEFORE UPDATE ON ShoppingCarts FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_categories BEFORE UPDATE ON Categories FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_user_credentials BEFORE UPDATE ON User_Credentials FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_access_tokens BEFORE UPDATE ON Access_Tokens FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_addresses BEFORE UPDATE ON Addresses FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_card BEFORE UPDATE ON Card FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_inventory BEFORE UPDATE ON Inventory FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_tags BEFORE UPDATE ON Tags FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_comments BEFORE UPDATE ON Comments FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_orders BEFORE UPDATE ON Orders FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_invoices BEFORE UPDATE ON Invoices FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_shipping_methods BEFORE UPDATE ON ShippingMethods FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE OR REPLACE FUNCTION update_order_total_price()
RETURNS TRIGGER AS $$
DECLARE
    v_order_id UUID; 
BEGIN
    IF (TG_OP = 'DELETE') THEN
        v_order_id := OLD.order_id; 
    ELSE
        v_order_id := NEW.order_id; 
    END IF;
    
    UPDATE Orders
    SET total_price = (
        SELECT COALESCE(SUM(quantity * price_at_purchase), 0)
        FROM OrderItems
        WHERE order_id = v_order_id
    )
    WHERE order_id = v_order_id; 
    
    RETURN NULL; 
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_order_total
AFTER INSERT OR UPDATE OR DELETE ON OrderItems
FOR EACH ROW
EXECUTE FUNCTION update_order_total_price();