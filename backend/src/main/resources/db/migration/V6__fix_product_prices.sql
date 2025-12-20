-- Update existing products with null prices to have a default value of 0.0
UPDATE products SET price = 0.0 WHERE price IS NULL;

-- Now make the price column NOT NULL
ALTER TABLE products ALTER COLUMN price SET NOT NULL;
