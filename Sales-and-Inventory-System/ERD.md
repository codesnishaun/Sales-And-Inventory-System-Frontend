# Entity Relationship Diagram (ERD)
## Sales and Inventory System

## Entities

### 1. SUPPLIES (Inventory)
**Description:** Raw materials and ingredients used to make menu items

**Attributes:**
- `id` (Primary Key) - Unique identifier
- `name` - Supply name (e.g., Coffee Beans, Milk)
- `stock` - Current stock quantity (numeric)
- `unit` - Unit of measurement (e.g., kg, L, pieces)
- `category` - Category classification (e.g., Raw Materials, Dairy, Ingredients)

**Relationships:**
- One-to-Many with SUPPLY_REQUIREMENTS (a supply can be required by multiple menu items)

---

### 2. MENU_ITEMS (Products)
**Description:** Products that customers can order, made from supplies

**Attributes:**
- `id` (Primary Key) - Unique identifier
- `name` - Menu item name (e.g., Signature Brew, Iced Spanish Latte)
- `price` - Selling price (numeric)
- `category` - Product category (e.g., Coffee, Pastry, Dessert)
- `supplyRequirements` - Array of supply requirements (embedded relationship)

**Relationships:**
- Many-to-Many with SUPPLIES (through SUPPLY_REQUIREMENTS)
- One-to-Many with SALE_ITEMS (a menu item can appear in multiple sales)

---

### 3. SUPPLY_REQUIREMENTS (Junction Entity)
**Description:** Links menu items to their required supplies with quantities

**Attributes:**
- `supplyId` (Foreign Key → SUPPLIES.id)
- `quantityPerOrder` - Quantity of supply needed per order of menu item (numeric)

**Relationships:**
- Many-to-One with SUPPLIES
- Many-to-One with MENU_ITEMS

---

### 4. SALES
**Description:** Sales transactions/orders

**Attributes:**
- `id` (Primary Key) - Unique identifier
- `customerName` - Name of the customer
- `total` - Total amount of the sale (numeric)
- `date` - Date and time of sale (timestamp)

**Relationships:**
- One-to-Many with SALE_ITEMS (a sale contains multiple items)

---

### 5. SALE_ITEMS
**Description:** Individual items within a sale transaction

**Attributes:**
- `productId` (Foreign Key → MENU_ITEMS.id)
- `productName` - Name of the product (denormalized for history)
- `price` - Price at time of sale (denormalized for history)
- `quantity` - Quantity ordered (numeric)
- `subtotal` - Line item total (price × quantity)

**Relationships:**
- Many-to-One with SALES (belongs to a sale)
- Many-to-One with MENU_ITEMS (references a menu item)

---

## Entity Relationship Diagram (Text Representation)

```
┌─────────────────────┐
│      SUPPLIES       │
├─────────────────────┤
│ PK  id              │
│     name            │
│     stock           │
│     unit            │
│     category        │
└──────────┬──────────┘
           │
           │ 1
           │
           │ M
┌──────────▼──────────────────┐
│  SUPPLY_REQUIREMENTS        │
│  (Embedded in MENU_ITEMS)   │
├─────────────────────────────┤
│ FK  supplyId → SUPPLIES.id  │
│     quantityPerOrder         │
└──────────┬──────────────────┘
           │
           │ M
           │
           │ 1
┌──────────▼──────────┐
│    MENU_ITEMS       │
├─────────────────────┤
│ PK  id              │
│     name            │
│     price           │
│     category        │
│     supplyRequirements[] │
└──────────┬──────────┘
           │
           │ 1
           │
           │ M
┌──────────▼──────────┐
│    SALE_ITEMS       │
├─────────────────────┤
│ FK  productId       │
│     productName     │
│     price           │
│     quantity        │
│     subtotal        │
└──────────┬──────────┘
           │
           │ M
           │
           │ 1
┌──────────▼──────────┐
│       SALES         │
├─────────────────────┤
│ PK  id              │
│     customerName    │
│     total           │
│     date            │
└─────────────────────┘
```

---

## Relationship Details

### 1. SUPPLIES ↔ MENU_ITEMS (Many-to-Many)
- **Relationship Type:** Many-to-Many through SUPPLY_REQUIREMENTS
- **Description:** A supply can be used in multiple menu items, and a menu item can require multiple supplies
- **Example:** Coffee Beans can be used in Signature Brew and Iced Spanish Latte

### 2. MENU_ITEMS ↔ SALE_ITEMS (One-to-Many)
- **Relationship Type:** One-to-Many
- **Description:** A menu item can appear in multiple sale transactions
- **Cardinality:** One menu item → Many sale items

### 3. SALES ↔ SALE_ITEMS (One-to-Many)
- **Relationship Type:** One-to-Many
- **Description:** A sale contains multiple items
- **Cardinality:** One sale → Many sale items

---

## Notes

1. **Storage Implementation:** The system uses localStorage (client-side storage), not a traditional database. The relationships are maintained through:
   - Embedded arrays (supplyRequirements in MENU_ITEMS)
   - Foreign key references (productId in SALE_ITEMS, supplyId in SUPPLY_REQUIREMENTS)

2. **Denormalization:** SALE_ITEMS stores productName and price to preserve historical data even if menu items are deleted or prices change.

3. **Supply Deduction:** When a sale is completed, the system automatically deducts supplies based on the supplyRequirements of each menu item in the sale.

