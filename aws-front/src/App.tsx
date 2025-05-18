import React, { useState } from "react";
import axios from "axios";

import { Plus, Coins } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "./components/ui/button";
import { Label } from "./components/ui/label";
import { Input } from "@/components/ui/input";
import Eua from './assets/flags/icons8-eua-48.png';
import Euro from './assets/flags/icons8-bandeira-da-europa-48.png';
import England from './assets/flags/icons8-inglaterra-48.png';
import Japan from './assets/flags/icons8-japão-48.png';
import Switzerland from './assets/flags/icons8-suíça-48.png';
import Emirados from './assets/flags/icons8-emirados-árabes-unidos-48.png'
import Argentina from './assets/flags/icons8-argentina-48.png';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Moeda = 'dolares' | 'euros' | 'libras' | 'iens' | 'francos' | 'pesos' | 'dirhans';

export function App() {
  const [valor, setValor] = useState<string>(""); // Estado para o valor a ser convertido
  const [moedaSelecionada, setMoedaSelecionada] = useState<Moeda>("dolares");
  const [resultado, setResultado] = useState<number | null>(null);

  // Função para tratar a mudança na seleção da moeda
  const handleSelectChange = (value: string) => {
    setMoedaSelecionada(value as Moeda);
    resetForm();
  };

  // Função para tratar a mudança no valor
  const handleValorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValor(event.target.value);
  };

  // Função para fazer a requisição à API e obter o valor convertido
  const handleConversao = async () => {
    try {
      const valorNumerico = parseFloat(valor.replace(',', '.')); // Converte o valor para número
      const response = await axios.get(`http://44.204.219.241:25000/conversao`, {
        params: {
          para: moedaSelecionada,
          valor: valorNumerico,
        },
      });

      // Arredonda para 2 casas decimais e atualiza o estado
      const valorConvertido = response.data.toFixed(2);
      setResultado(parseFloat(valorConvertido));
    } catch (error) {
      console.error("Erro na conversão:", error);
    }
  };

  const resetForm = () => {
    setResultado(null)
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="absolute top-[20px] right-[20px] cursor-pointer">
            <Plus />
            Cadastrar
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar moeda para conversão</DialogTitle>
            <DialogDescription>
              Complete com o nome do país e o valor da moeda comparado ao Brasil.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pais" className="text-right">
                País
              </Label>
              <Input id="pais" placeholder="Alemanha, Congo..." className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Valor (R$)
              </Label>
              <Input id="username" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="cursor-pointer">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="w-full min-h-screen flex items-center justify-center">
        <Card className="w-[500px]">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-[10px]">
              Conversor de moeda
              <Coins />
            </CardTitle>
            <CardDescription>Digite a quantia (em reais) e para qual moeda deseja converter.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 flex items-center justify-around gap-2">
            <Input
              type="number"
              value={valor}
              onChange={handleValorChange}
              placeholder="Ex: 40,00"
            />
            <Select onValueChange={handleSelectChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Converter para..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Moedas</SelectLabel>
                  <SelectItem value="dolares">
                    <img src={Eua} alt="Eua" width="20" height="20" />
                    Dolar
                  </SelectItem>
                  <SelectItem value="euros">
                    <img src={Euro} alt="Europa" width="20" height="20" />
                    Euro
                  </SelectItem>
                  <SelectItem value="libras">
                    <img src={England} alt="Inglaterra" width="20" height="20" />
                    Libra
                  </SelectItem>
                  <SelectItem value="iens">
                    <img src={Japan} alt="Japao" width="20" height="20" />
                    Ien
                  </SelectItem>
                  <SelectItem value="francos">
                    <img src={Switzerland} alt="Suica" width="20" height="20" />
                    Franco suico
                  </SelectItem>
                  <SelectItem value="dirhans">
                    <img src={Emirados} alt="Emirados" width="20" height="20" />
                    Dirrã
                  </SelectItem>
                  <SelectItem value="pesos">
                    <img src={Argentina} alt="Argentina" width="20" height="20" />
                    Peso argentino
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={resetForm}>Cancelar</Button>
            <Button onClick={handleConversao}>Converter</Button>
          </CardFooter>
          {resultado !== null && (
            <div className="text-center mt-4">
              <h2><b className="text-4xl text-emerald-500">{resultado}</b> ({moedaSelecionada})</h2>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
