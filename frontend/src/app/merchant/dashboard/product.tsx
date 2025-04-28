import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import dayjs from 'dayjs';

export function Product({ product }: { product: any }) {
  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        {Boolean(product?.images[0]) ? (
          <Image
            alt="Product image"
            className="aspect-square rounded-md object-cover"
            height="64"
            src={product?.images[0]?.url}
            width="64"
          />
        ) : null}
      </TableCell>
      <TableCell className="font-medium">{product.title}</TableCell>
      <TableCell className="hidden md:table-cell">
        {new Intl.NumberFormat(product.locale || 'en-US', {
          style: 'currency',
          currency: product.currency || 'USD',
        }).format(product.price)}
      </TableCell>
      <TableCell className="hidden md:table-cell">{product.quantity}</TableCell>
      <TableCell className="hidden md:table-cell">
        {dayjs(product.createdAt).format('DD MMM YYYY HH:mm:ss')}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {product.createdBy}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {dayjs(product.updatedAt).format('DD MMM YYYY HH:mm:ss')}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {product.updatedBy}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>
              {/* <form action={deleteProduct}> */}
              <button type="submit">Delete</button>
              {/* </form> */}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
