import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart, CartItem } from '@/contexts/CartContext';
import { scanProduct } from '@/services/OCRService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Camera, Plus, Minus, Trash2, Check, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Cart = () => {
  const { items, budget, totalSpent, remainingBudget, addItem, updateItem, removeItem, finalizePurchase } = useCart();
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editQuantity, setEditQuantity] = useState('1');

  const budgetPercentage = budget > 0 ? (remainingBudget / budget) * 100 : 100;
  const budgetColor = budgetPercentage > 30 ? 'text-primary' : budgetPercentage > 10 ? 'text-warning' : 'text-destructive';

  const handleScan = async () => {
    setIsScanning(true);
    try {
      const product = await scanProduct();
      addItem({ name: product.name, unitPrice: product.price, quantity: 1 });
      toast({ title: 'Produto escaneado!', description: `${product.name} - R$ ${product.price.toFixed(2)}` });
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao escanear produto', variant: 'destructive' });
    } finally {
      setIsScanning(false);
    }
  };

  const handleEdit = (item: CartItem) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditPrice(item.unitPrice.toFixed(2));
    setEditQuantity(item.quantity.toString());
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    updateItem(editingItem.id, {
      name: editName,
      unitPrice: parseFloat(editPrice.replace(',', '.')),
      quantity: parseInt(editQuantity)
    });
    setEditingItem(null);
    toast({ title: 'Produto atualizado!' });
  };

  const handleFinish = () => {
    finalizePurchase();
    toast({ title: 'Compra finalizada!', description: 'Dados salvos no histórico' });
    navigate('/setup');
  };

  if (budget === 0) {
    navigate('/setup');
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-primary text-primary-foreground p-4 pb-8 rounded-b-3xl shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/setup')} className="text-primary-foreground hover:bg-primary-foreground/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Carrinho</h1>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-primary-foreground/10 border-0">
            <CardContent className="p-4 text-center">
              <p className="text-sm opacity-80">Orçamento Restante</p>
              <p className={cn("text-2xl font-bold", remainingBudget < 0 ? "text-destructive" : "text-primary-foreground")}>
                R$ {remainingBudget.toFixed(2)}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-primary-foreground/10 border-0">
            <CardContent className="p-4 text-center">
              <p className="text-sm opacity-80">Total Gasto</p>
              <p className="text-2xl font-bold">R$ {totalSpent.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>
        {/* Progress bar */}
        <div className="mt-4 h-2 bg-primary-foreground/20 rounded-full overflow-hidden">
          <div 
            className={cn("h-full transition-all duration-300", remainingBudget < 0 ? "bg-destructive" : "bg-primary-foreground")}
            style={{ width: `${Math.max(0, Math.min(100, 100 - budgetPercentage))}%` }}
          />
        </div>
      </div>

      {/* Items List */}
      <div className="p-4 space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Nenhum produto adicionado</p>
            <p className="text-sm">Toque no botão abaixo para escanear</p>
          </div>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="shadow-soft animate-in fade-in slide-in-from-left-2 duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1" onClick={() => handleEdit(item)}>
                    <h3 className="font-medium text-foreground">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      R$ {item.unitPrice.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-primary">R$ {(item.unitPrice * item.quantity).toFixed(2)}</p>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateItem(item.id, { quantity: Math.max(1, item.quantity - 1) })}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateItem(item.id, { quantity: item.quantity + 1 })}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border flex gap-3">
        <Button
          onClick={handleScan}
          disabled={isScanning}
          className="flex-1 h-14 text-lg gradient-primary gap-2"
        >
          {isScanning ? <Loader2 className="w-6 h-6 animate-spin" /> : <Camera className="w-6 h-6" />}
          {isScanning ? 'Escaneando...' : 'Escanear'}
        </Button>
        {items.length > 0 && (
          <Button
            onClick={handleFinish}
            variant="secondary"
            className="h-14 px-6 text-lg gap-2"
          >
            <Check className="w-6 h-6" />
            Finalizar
          </Button>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Nome do produto"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <Input
              placeholder="Preço unitário"
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Quantidade"
              value={editQuantity}
              onChange={(e) => setEditQuantity(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingItem(null)}>Cancelar</Button>
            <Button onClick={handleSaveEdit} className="gradient-primary">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cart;
