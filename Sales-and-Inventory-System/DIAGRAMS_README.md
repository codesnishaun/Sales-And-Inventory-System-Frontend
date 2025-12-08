# System Diagrams Documentation

This directory contains Entity Relationship Diagrams (ERD) and Data Flow Diagrams (DFD) for the Sales and Inventory System.

## Files Overview

### ERD (Entity Relationship Diagram)
- **ERD.md** - Detailed text-based ERD with entity descriptions, attributes, and relationships
- **ERD.mmd** - Mermaid diagram format for visual rendering

### DFD (Data Flow Diagram)
- **DFD.md** - Comprehensive DFD documentation with process descriptions and data flows
- **DFD_Context.mmd** - Context diagram (Level 0 DFD)
- **DFD.mmd** - Level 1 DFD (main processes)
- **DFD_Level1_Detailed.mmd** - Detailed Level 1 DFD with process descriptions

## How to View the Diagrams

### Option 1: Using Mermaid (Recommended)
The `.mmd` files can be rendered using:

1. **Online Tools:**
   - [Mermaid Live Editor](https://mermaid.live/) - Copy and paste the `.mmd` file content
   - [GitHub/GitLab** - Mermaid diagrams render automatically in markdown files

2. **VS Code Extension:**
   - Install "Markdown Preview Mermaid Support" extension
   - Open the `.mmd` files or embed them in markdown

3. **Documentation Tools:**
   - Many documentation platforms (GitBook, Notion, etc.) support Mermaid syntax

### Option 2: Text-Based Documentation
The `.md` files contain detailed text descriptions and ASCII art representations that can be viewed in any text editor or markdown viewer.

## System Overview

### Entities
1. **SUPPLIES** - Raw materials and ingredients
2. **MENU_ITEMS** - Products available for sale
3. **SUPPLY_REQUIREMENTS** - Links menu items to required supplies
4. **SALES** - Sales transactions
5. **SALE_ITEMS** - Individual items in a sale

### Main Processes
1. **Manage Inventory** - Add, update, delete supplies
2. **Manage Menu Items** - Create and manage products
3. **Process Sales Order** - Handle customer orders
4. **Complete Sale** - Finalize transactions and update inventory
5. **Generate Reports** - Dashboard statistics and sales history

## Quick Reference

### ERD Relationships
- SUPPLIES ↔ MENU_ITEMS: Many-to-Many (through SUPPLY_REQUIREMENTS)
- MENU_ITEMS → SALE_ITEMS: One-to-Many
- SALES → SALE_ITEMS: One-to-Many

### Data Flow Summary
- **Input:** Supply info, menu item info, customer orders
- **Processing:** Inventory management, sales processing, stock deduction
- **Output:** Inventory displays, sales records, reports

## Notes

- The system uses localStorage for data persistence
- Supply stock is automatically deducted when sales are completed
- Menu items can have multiple supply requirements
- Sale items preserve historical data (product name and price at time of sale)

