# Diagrama Entidade-Relacionamento (Conecta Market)

Este documento contém o modelo de dados da plataforma, descrevendo a estrutura relacional do banco de dados PostgreSQL utilizando Prisma.

## Diagrama ER (Mermaid)

```mermaid
erDiagram
    User {
        String id PK
        String email
        String password
        String name
        String document "CPF/CNPJ"
        String phone
        Enum role "ADMIN, SELLER, SUPPLIER, CUSTOMER"
        Boolean isActive
        DateTime createdAt
        DateTime updatedAt
    }

    Store {
        String id PK
        String name
        String slug
        String description
        String logo
        String banner
        Enum type "B2C, B2B, HYBRID"
        String cnpj
        String phone
        String email
        String website
        Enum status "PENDING, ACTIVE, SUSPENDED, REJECTED"
        String ownerId FK
        DateTime createdAt
        DateTime updatedAt
    }

    Product {
        String id PK
        String storeId FK
        String categoryId FK
        String name
        String slug
        String description
        Float basePrice
        Float b2bPrice
        Int minB2bQuantity
        Int stock
        String sku
        String[] images
        Boolean isActive
        Boolean isFeatured
        DateTime createdAt
        DateTime updatedAt
    }

    Category {
        String id PK
        String name
        String slug
        String description
        String image
        String parentId FK "Opcional"
        DateTime createdAt
        DateTime updatedAt
    }

    Order {
        String id PK
        String userId FK
        String storeId FK
        Float totalAmount
        Enum status "PENDING, PAID, SHIPPED, DELIVERED, CANCELLED"
        String shippingAddress
        String trackingCode
        DateTime createdAt
        DateTime updatedAt
    }

    OrderItem {
        String id PK
        String orderId FK
        String productId FK
        Int quantity
        Float unitPrice
        Float totalPrice
    }

    User ||--o{ Store : "owns"
    Store ||--o{ Product : "sells"
    Category ||--o{ Product : "contains"
    Category ||--o{ Category : "parent/child"
    User ||--o{ Order : "places"
    Store ||--o{ Order : "receives"
    Order ||--|{ OrderItem : "contains"
    Product ||--o{ OrderItem : "included in"
```

## Prisma Schema (Referência)

O banco de dados é gerido via Prisma. Para visualizar o schema completo, consulte o arquivo `apps/api/prisma/schema.prisma`.
