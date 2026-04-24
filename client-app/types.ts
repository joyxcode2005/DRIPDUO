export type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

export interface Product {
  id: number;
  name: string;
  price: number;
  type: string;
  category: string;
  image: string;
}