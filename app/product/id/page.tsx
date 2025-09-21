import ProductPage from '../../../components/ProductPage'

interface ProductPageProps {
  params: {
    id: string
  }
  searchParams: {
    artist?: string
  }
}

export default function Product({ params, searchParams }: ProductPageProps) {
  return (
    <ProductPage 
      productId={params.id} 
      isArtistView={searchParams.artist === 'true'}
    />
  )
}
