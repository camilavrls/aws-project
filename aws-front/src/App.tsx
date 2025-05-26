import React, { useEffect, useState } from "react";
import axios from "axios";

import { Plus, Coins, Edit2, Trash2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "./components/ui/button";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Moeda = {
  nome: string;
  valor: number;
};

export function App() {
  // Estados gerais
  const [moedas, setMoedas] = useState<Moeda[]>([]);
  const [moedaSelecionada, setMoedaSelecionada] = useState<string | null>(null);
  const [valorConverter, setValorConverter] = useState("");
  const [resultado, setResultado] = useState<number | null>(null);

  const [openCriar, setOpenCriar] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [openDeletar, setOpenDeletar] = useState(false);

  // Form Criar
  const [nomeCriar, setNomeCriar] = useState("");
  const [valorCriar, setValorCriar] = useState("");

  // Form Editar
  const [nomeEditar, setNomeEditar] = useState("");
  const [valorEditar, setValorEditar] = useState("");

  // Form Deletar
  const [nomeDeletar, setNomeDeletar] = useState("");

  useEffect(() => {
    fetchMoedas();
  }, []);

  async function fetchMoedas() {
    try {
      const res = await axios.get<Moeda[]>("http://127.0.0.1:5000/moedas");
      if (Array.isArray(res.data)) {
        setMoedas(res.data);
        if (!moedaSelecionada && res.data.length > 0) {
          setMoedaSelecionada(res.data[0].nome);
        }
      } else {
        setMoedas([]);
      }
    } catch {
      setMoedas([]);
    }
  }

  function moedaExiste(nome: string) {
    return moedas.some((m) => m.nome.toLowerCase() === nome.toLowerCase());
  }

  async function criarMoeda() {
    if (!nomeCriar.trim() || !valorCriar.trim()) {
      alert("Preencha nome e valor");
      return;
    }
    const valorNum = parseFloat(valorCriar);
    if (isNaN(valorNum) || valorNum <= 0) {
      alert("Valor deve ser positivo e numérico");
      return;
    }
    if (moedaExiste(nomeCriar)) {
      alert("Moeda já existe");
      return;
    }
    try {
      await axios.post("http://127.0.0.1:5000/moedas", { nome: nomeCriar.trim(), valor: valorNum });
      setOpenCriar(false);
      setNomeCriar("");
      setValorCriar("");
      fetchMoedas();
    } catch (e) {
      alert("Erro ao criar moeda, " + e);
    }
  }

  useEffect(() => {
    if (openEditar) {
      if (moedaExiste(nomeEditar)) {
        const moeda = moedas.find(
          (m) => m.nome.toLowerCase() === nomeEditar.toLowerCase()
        );
        if (moeda) setValorEditar(moeda.valor.toString());
      } else {
        setValorEditar("");
      }
    } else {
      setNomeEditar("");
      setValorEditar("");
    }
  }, [openEditar, nomeEditar, moedas]);

  async function editarMoeda() {
    if (!nomeEditar.trim() || !valorEditar.trim()) {
      alert("Preencha nome e valor");
      return;
    }
    if (!moedaExiste(nomeEditar)) {
      alert("Moeda não existe");
      return;
    }
    const valorNum = parseFloat(valorEditar);
    if (isNaN(valorNum) || valorNum <= 0) {
      alert("Valor deve ser positivo e numérico");
      return;
    }
    try {
      await axios.put(`http://127.0.0.1:5000/moedas/${nomeEditar.trim()}`, { valor: valorNum });
      setOpenEditar(false);
      setNomeEditar("");
      setValorEditar("");
      fetchMoedas();
    } catch {
      alert("Erro ao editar moeda");
    }
  }

  async function deletarMoeda() {
    if (!nomeDeletar.trim()) {
      alert("Informe o nome da moeda para deletar");
      return;
    }
    if (!moedaExiste(nomeDeletar)) {
      alert("Moeda não existe");
      return;
    }
    try {
      await axios.delete(`http://127.0.0.1:5000/moedas/${nomeDeletar.trim()}`);
      setOpenDeletar(false);
      setNomeDeletar("");
      fetchMoedas();
    } catch {
      alert("Erro ao deletar moeda");
    }
  }

  function handleConversao() {
    if (!valorConverter.trim() || !moedaSelecionada) {
      alert("Informe valor e moeda");
      return;
    }
    const moeda = moedas.find((m) => m.nome === moedaSelecionada);
    if (!moeda) {
      alert("Moeda inválida");
      return;
    }
    const num = Number(valorConverter);
    if (isNaN(num)) {
      alert("Valor inválido");
      return;
    }
    setResultado(num * moeda.valor);
  }

  return (
    <div className="max-h-screen p-4 bg-gray-50 flex items-center justify-center">
      {/* Botões principais */}
      <div className="flex justify-end gap-2 mb-4">
        <Button variant="outline" onClick={() => setOpenCriar(true)} className="absolute top-[60px] right-[20px]">
          <Plus /> Cadastrar
        </Button>
        <Button variant="outline" onClick={() => setOpenEditar(true)} className="absolute top-[20px] right-[20px]">
          <Edit2 /> Editar
        </Button>
        <Button
          variant="outline"
          onClick={() => setOpenDeletar(true)}
          className="absolute top-[100px] right-[20px]"
        >
          <Trash2 /> Deletar
        </Button>
      </div>

      {/* Modal Criar */}
      <Dialog open={openCriar} onOpenChange={setOpenCriar}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar moeda para conversão</DialogTitle>
            <DialogDescription>
              Complete com o nome do país e o valor da moeda comparado ao Brasil.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nomeCriar" className="text-right">
                Nome
              </Label>
              <Input
                id="nomeCriar"
                value={nomeCriar}
                onChange={(e) => setNomeCriar(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="valorCriar" className="text-right">
                Valor (R$)
              </Label>
              <Input
                id="valorCriar"
                type="number"
                value={valorCriar}
                onChange={(e) => setValorCriar(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpenCriar(false);
                setNomeCriar("");
                setValorCriar("");
              }}
            >
              Cancelar
            </Button>
            <Button onClick={criarMoeda}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Editar */}
      <Dialog open={openEditar} onOpenChange={setOpenEditar}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar moeda</DialogTitle>
            <DialogDescription>
              Informe o nome da moeda para editar e seu novo valor.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nomeEditar" className="text-right">
                Nome da moeda
              </Label>
              <Input
                id="nomeEditar"
                value={nomeEditar}
                onChange={(e) => setNomeEditar(e.target.value)}
                placeholder="Digite o nome exato"
              />
            </div>
            {nomeEditar.trim() !== "" && !moedaExiste(nomeEditar) && (
              <p className="text-red-600 col-span-4 text-center">
                Moeda não encontrada
              </p>
            )}
            {moedaExiste(nomeEditar) && (
              <>
                <div className="grid grid-cols-4 items-center gap-4 mt-4">
                  <Label htmlFor="valorEditar" className="text-right">
                    Novo valor (R$)
                  </Label>
                  <Input
                    id="valorEditar"
                    type="number"
                    value={valorEditar}
                    onChange={(e) => setValorEditar(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpenEditar(false);
                setNomeEditar("");
                setValorEditar("");
              }}
            >
              Cancelar
            </Button>
            <Button onClick={editarMoeda} disabled={!moedaExiste(nomeEditar)}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDeletar} onOpenChange={setOpenDeletar}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Deletar moeda</DialogTitle>
            <DialogDescription>
              Informe o nome da moeda para exclusão.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="nomeDeletar" className="text-right">
              Nome da moeda
            </Label>
            <Input
              id="nomeDeletar"
              value={nomeDeletar}
              onChange={(e) => setNomeDeletar(e.target.value)}
              placeholder="Digite o nome exato"
            />
            {nomeDeletar.trim() !== "" && !moedaExiste(nomeDeletar) && (
              <p className="text-red-600 text-center mt-2">Moeda não encontrada</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpenDeletar(false);
                setNomeDeletar("");
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="outline"
              onClick={deletarMoeda}
              disabled={!moedaExiste(nomeDeletar)}
            >
              Deletar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Card conversor */}
      <div className="w-full min-h-screen flex items-center justify-center">
        <Card className="w-[600px]">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-[10px]">
              Conversor de moeda <Coins />
            </CardTitle>
            <CardDescription>
              Digite a quantia (em reais) e para qual moeda deseja converter.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 flex items-center justify-around gap-2 flex-wrap">
            <Input
              type="number"
              value={valorConverter}
              onChange={(e) => setValorConverter(e.target.value)}
              placeholder="Ex: 40,00"
              className="max-w-[180px]"
            />
            <Select
              onValueChange={setMoedaSelecionada}
              value={moedaSelecionada ?? undefined}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Converter para..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {moedas.map((moeda) => (
                    <SelectItem key={moeda.nome} value={moeda.nome}>
                      {moeda.nome}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardContent>
          <CardFooter className="flex justify-between flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setValorConverter("");
                setMoedaSelecionada(null);
                setResultado(null);
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleConversao}>Converter</Button>
          </CardFooter>
          {resultado !== null && (
            <div className="text-center mt-4">
              <h2>
                <b className="text-4xl text-emerald-500">
                  {resultado.toFixed(2)}
                </b>{" "}
                ({moedaSelecionada})
              </h2>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
