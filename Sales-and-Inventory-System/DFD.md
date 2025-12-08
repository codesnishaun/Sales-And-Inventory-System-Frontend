# Data Flow Diagram (DFD)
## Sales and Inventory System

## Context Diagram (Level 0)

```
                    ┌─────────────────────────────┐
                    │                             │
    Customer Info   │   Sales and Inventory       │
    ───────────────>│        System              │
                    │                             │
    Order Details   │                             │
    <───────────────│                             │
                    │                             │
    Supply Data     │                             │
    ───────────────>│                             │
                    │                             │
    Inventory Info  │                             │
    <───────────────│                             │
                    │                             │
    Sales Reports   │                             │
    <───────────────│                             │
                    └─────────────────────────────┘
```

**External Entities:**
- **Staff/User** - System operator managing inventory and sales
- **Customer** - End customer placing orders

---

## Level 1 DFD - Main Processes

```
┌──────────────┐
│   Staff/User │
└──────┬───────┘
       │
       │ Supply Info
       │
       ▼
┌─────────────────────┐         ┌──────────────────┐
│  1.0 Manage         │────────>│   SUPPLIES       │
│     Inventory       │         │   (Data Store)   │
│                     │<────────│                  │
└─────────────────────┘         └──────────────────┘
       │
       │ Menu Item Info
       │
       ▼
┌─────────────────────┐         ┌──────────────────┐
│  2.0 Manage         │────────>│   MENU_ITEMS     │
│     Menu Items      │         │   (Data Store)   │
│                     │<────────│                  │
└─────────────────────┘         └──────────────────┘
       │
       │ Supply Requirements
       │
       └───────────────────────┐
                               │
                               ▼
                    ┌──────────────────┐
                    │   SUPPLIES       │
                    │   (Data Store)   │
                    └──────────────────┘

┌──────────────┐
│   Customer   │
└──────┬───────┘
       │
       │ Order Request
       │
       ▼
┌─────────────────────┐
│  3.0 Process        │
│     Sales Order     │
└──────┬──────────────┘
       │
       │ Check Availability
       │
       ├───────────────────────┐
       │                       │
       ▼                       ▼
┌──────────────────┐   ┌──────────────────┐
│   MENU_ITEMS     │   │   SUPPLIES       │
│   (Data Store)   │   │   (Data Store)   │
└──────────────────┘   └──────────────────┘
       │                       │
       │                       │
       └───────────┬───────────┘
                   │
                   │ Update Stock
                   │
                   ▼
┌─────────────────────┐         ┌──────────────────┐
│  4.0 Complete        │────────>│   SALES          │
│     Sale            │         │   (Data Store)   │
│                     │<────────│                  │
└─────────────────────┘         └──────────────────┘
       │
       │ Sales Data
       │
       ▼
┌─────────────────────┐
│  5.0 Generate       │
│     Reports         │
└──────┬──────────────┘
       │
       │ Reports
       │
       ▼
┌──────────────┐
│   Staff/User │
└──────────────┘
```

---

## Detailed Process Descriptions

### Process 1.0: Manage Inventory
**Input:** Supply information (name, stock, unit, category)
**Output:** Updated supply records
**Data Stores:** SUPPLIES
**Operations:**
- Add new supply
- Update existing supply (stock, name, unit, category)
- Delete supply
- Check stock levels

**Data Flows:**
- Supply Info → Process 1.0 → SUPPLIES
- SUPPLIES → Process 1.0 → Inventory Display

---

### Process 2.0: Manage Menu Items
**Input:** Menu item information (name, price, category, supply requirements)
**Output:** Updated menu item records
**Data Stores:** MENU_ITEMS, SUPPLIES (for validation)
**Operations:**
- Add new menu item
- Update menu item
- Delete menu item
- Link menu items to supplies (supply requirements)

**Data Flows:**
- Menu Item Info → Process 2.0 → MENU_ITEMS
- Supply Requirements → Process 2.0 → MENU_ITEMS
- SUPPLIES → Process 2.0 → (validation)
- MENU_ITEMS → Process 2.0 → Menu Display

---

### Process 3.0: Process Sales Order
**Input:** Customer name, selected menu items, quantities
**Output:** Cart items, availability status
**Data Stores:** MENU_ITEMS, SUPPLIES
**Operations:**
- Select menu items
- Add items to cart
- Check supply availability for each item
- Calculate subtotals
- Validate quantities against available supplies

**Data Flows:**
- Order Request → Process 3.0
- Process 3.0 → MENU_ITEMS (read menu items)
- Process 3.0 → SUPPLIES (check availability)
- MENU_ITEMS → Process 3.0 → Available Products
- SUPPLIES → Process 3.0 → Stock Status
- Process 3.0 → Cart Items

---

### Process 4.0: Complete Sale
**Input:** Cart items, customer name, total amount
**Output:** Sale record, updated supply stock
**Data Stores:** SALES, SUPPLIES, MENU_ITEMS
**Operations:**
- Create sale record
- Deduct supplies based on menu item requirements
- Calculate total
- Store sale with timestamp

**Data Flows:**
- Cart Items → Process 4.0
- Process 4.0 → SALES (create sale record)
- Process 4.0 → SUPPLIES (deduct stock)
- Process 4.0 → MENU_ITEMS (read supply requirements)
- Process 4.0 → Sale Confirmation

**Detailed Flow:**
```
Cart Items
    │
    ▼
┌──────────────────────┐
│ Calculate Total      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Create Sale Record   │
│ - id                 │
│ - customerName       │
│ - items              │
│ - total              │
│ - date               │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ For each item:       │
│ 1. Get menu item     │
│ 2. Get requirements  │
│ 3. Calculate deduction│
│ 4. Update supply stock│
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Save to SALES        │
└──────────────────────┘
```

---

### Process 5.0: Generate Reports
**Input:** Sales data, inventory data
**Output:** Dashboard statistics, sales history
**Data Stores:** SALES, MENU_ITEMS, SUPPLIES
**Operations:**
- Calculate total revenue
- Count total sales
- Count today's sales
- Identify low stock items
- Calculate inventory value
- Display sales history

**Data Flows:**
- SALES → Process 5.0 → Revenue Statistics
- MENU_ITEMS → Process 5.0 → Product Count
- SUPPLIES → Process 5.0 → Inventory Statistics
- Process 5.0 → Dashboard Reports

---

## Data Store Details

### SUPPLIES (D1)
**Contents:**
- Supply records with id, name, stock, unit, category

**Access:**
- Read by: Process 1.0, 2.0, 3.0, 4.0, 5.0
- Write by: Process 1.0, 4.0

---

### MENU_ITEMS (D2)
**Contents:**
- Menu item records with id, name, price, category, supplyRequirements

**Access:**
- Read by: Process 2.0, 3.0, 4.0, 5.0
- Write by: Process 2.0

---

### SALES (D3)
**Contents:**
- Sale records with id, customerName, items, total, date

**Access:**
- Read by: Process 5.0
- Write by: Process 4.0

---

## Data Flow Summary

### External to System:
1. **Supply Information** (Staff → Process 1.0)
2. **Menu Item Information** (Staff → Process 2.0)
3. **Order Request** (Customer → Process 3.0)
4. **Customer Name** (Customer → Process 3.0)

### System to External:
1. **Inventory Display** (Process 1.0 → Staff)
2. **Menu Display** (Process 2.0 → Staff)
3. **Order Confirmation** (Process 4.0 → Customer)
4. **Dashboard Reports** (Process 5.0 → Staff)
5. **Sales History** (Process 5.0 → Staff)

### Internal Data Flows:
1. **Supply Requirements** (Process 2.0 → MENU_ITEMS)
2. **Availability Check** (Process 3.0 ↔ SUPPLIES)
3. **Stock Deduction** (Process 4.0 → SUPPLIES)
4. **Sale Record** (Process 4.0 → SALES)
5. **Statistics Calculation** (Process 5.0 ↔ All Data Stores)

---

## Process Flow Sequence

### Sales Transaction Flow:
```
1. Customer provides order details
   ↓
2. Process 3.0: Check menu item availability
   ↓
3. Process 3.0: Validate supply stock
   ↓
4. Process 3.0: Add to cart
   ↓
5. Process 4.0: Calculate total
   ↓
6. Process 4.0: Create sale record
   ↓
7. Process 4.0: Deduct supplies
   ↓
8. Process 4.0: Update SUPPLIES
   ↓
9. Process 4.0: Save to SALES
   ↓
10. Process 5.0: Update statistics
```

### Inventory Management Flow:
```
1. Staff provides supply information
   ↓
2. Process 1.0: Validate data
   ↓
3. Process 1.0: Create/Update/Delete supply
   ↓
4. Process 1.0: Update SUPPLIES
   ↓
5. Process 5.0: Recalculate statistics
```

---

## Notes

1. **Real-time Updates:** When a sale is completed, supplies are immediately deducted, ensuring inventory accuracy.

2. **Validation:** Process 3.0 validates supply availability before allowing items to be added to cart, preventing overselling.

3. **Data Persistence:** All data is stored in localStorage, which acts as the persistent data store.

4. **Supply Requirements:** Menu items can have multiple supply requirements, and the system calculates total deductions based on quantity ordered.

5. **Historical Data:** Sale items store product name and price at time of sale, preserving historical accuracy even if menu items are modified or deleted.

