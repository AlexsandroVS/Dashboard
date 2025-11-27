import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number; // Optional if we don't know total count, but good for UX
    onPageChange: (page: number) => void;
    hasNextPage: boolean;
}

export function SimplePagination({ currentPage, onPageChange, hasNextPage }: PaginationProps) {
    return (
        <div className="flex items-center justify-end space-x-2 py-4">
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
            >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
            </Button>
            <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Página {currentPage}
            </div>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!hasNextPage}
            >
                Siguiente
                <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
        </div>
    )
}
