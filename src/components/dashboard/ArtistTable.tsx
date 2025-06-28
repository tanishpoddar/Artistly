'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { Artist, categories } from '@/lib/types';
import { Badge } from '../ui/badge';

interface ArtistTableProps {
  data: Artist[];
}

export function ArtistTable({ data }: ArtistTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Categories</TableHead>
          <TableHead className="hidden md:table-cell">Location</TableHead>
          <TableHead className="hidden sm:table-cell">Fee Range</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((artist) => (
          <TableRow key={artist.id}>
            <TableCell className="font-medium">{artist.name}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {artist.categories.map((category) => {
                   const catLabel = categories.find(c => c.value === category)?.label || category;
                   return <Badge key={category} variant="secondary" className="capitalize">{catLabel}</Badge>
                })}
              </div>
            </TableCell>
            <TableCell className="hidden md:table-cell">{artist.location}</TableCell>
            <TableCell className="hidden sm:table-cell">{`$${artist.priceRange.min} - $${artist.priceRange.max}`}</TableCell>
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
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
