import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCountingStore } from '@/store/countingStore';
import { CountingInterface } from '@/components/counting/CountingInterface';
import type { SectorCount, CountItem, Product } from '@/types/database';

export default function CountingPage() {
  const { countingId, sectorId } = useParams();
  const { initializeSession } = useCountingStore();

  useEffect(() => {
    // Mock data - replace with real API calls
    const mockProducts: Product[] = [
      {
        id: '1',
        company_id: '1',
        code: 'P001',
        name: 'Arroz Branco 1kg',
        description: 'Arroz tipo 1, pacote de 1kg',
        unit_measure: 'kg',
        category: 'Grãos',
        min_stock: 10,
        max_stock: 100,
        cost_price: 5.50,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        company_id: '1',
        code: 'P002',
        name: 'Feijão Preto 1kg',
        description: 'Feijão preto, pacote de 1kg',
        unit_measure: 'kg',
        category: 'Grãos',
        min_stock: 5,
        max_stock: 50,
        cost_price: 7.80,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        company_id: '1',
        code: 'P003',
        name: 'Óleo de Soja 900ml',
        description: 'Óleo de soja refinado, garrafa 900ml',
        unit_measure: 'un',
        category: 'Óleos',
        min_stock: 20,
        max_stock: 200,
        cost_price: 8.90,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '4',
        company_id: '1',
        code: 'P004',
        name: 'Açúcar Cristal 1kg',
        description: 'Açúcar cristal, pacote de 1kg',
        unit_measure: 'kg',
        category: 'Açúcares',
        min_stock: 15,
        max_stock: 150,
        cost_price: 4.20,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '5',
        company_id: '1',
        code: 'P005',
        name: 'Sal Refinado 1kg',
        description: 'Sal refinado iodado, pacote de 1kg',
        unit_measure: 'kg',
        category: 'Temperos',
        min_stock: 10,
        max_stock: 100,
        cost_price: 2.50,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    const mockCountItems: CountItem[] = mockProducts.map((product, index) => ({
      id: `item-${index + 1}`,
      sector_count_id: 'sector-count-1',
      product_id: product.id,
      expected_quantity: Math.floor(Math.random() * 50) + 10, // Random expected quantity
      counted_quantity: undefined,
      difference: undefined,
      observations: undefined,
      is_counted: false,
      counted_at: undefined,
      created_at: new Date().toISOString(),
      product
    }));

    const mockSectorCount: SectorCount = {
      id: 'sector-count-1',
      inventory_count_id: countingId || 'count-1',
      sector_id: sectorId || 'sector-1',
      employee_name: 'Funcionário Demo',
      employee_id: '12345',
      status: 'in_progress',
      started_at: new Date().toISOString(),
      completed_at: undefined,
      total_products: mockCountItems.length,
      counted_products: 0,
      created_at: new Date().toISOString(),
      sector: {
        id: sectorId || 'sector-1',
        company_id: '1',
        name: 'Cozinha Principal',
        description: 'Cozinha principal do restaurante',
        is_active: true,
        created_at: new Date().toISOString()
      },
      count_items: mockCountItems
    };

    // Initialize the counting session
    initializeSession(mockSectorCount, mockCountItems);
  }, [countingId, sectorId, initializeSession]);

  return <CountingInterface />;
}