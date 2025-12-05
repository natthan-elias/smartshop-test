// Mock OCR Service - Replace with Google Vision API later
const mockProducts = [
  { name: 'Leite Integral', price: 5.99 },
  { name: 'Pão de Forma', price: 8.50 },
  { name: 'Arroz 5kg', price: 24.90 },
  { name: 'Feijão 1kg', price: 9.99 },
  { name: 'Café 500g', price: 18.90 },
  { name: 'Açúcar 1kg', price: 5.49 },
  { name: 'Óleo de Soja', price: 7.99 },
  { name: 'Macarrão 500g', price: 4.50 },
  { name: 'Molho de Tomate', price: 3.99 },
  { name: 'Biscoito', price: 6.50 },
  { name: 'Sabonete', price: 2.99 },
  { name: 'Detergente', price: 3.49 },
];

export interface ScannedProduct {
  name: string;
  price: number;
}

export const scanProduct = async (): Promise<ScannedProduct> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return random mock product
  const randomIndex = Math.floor(Math.random() * mockProducts.length);
  return mockProducts[randomIndex];
};
