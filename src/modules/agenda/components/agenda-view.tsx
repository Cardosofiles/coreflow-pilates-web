"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgendamentosTable } from "./agendamentos-table";
import { SessoesTable } from "./sessoes-table";

export function AgendaView() {
  const [tab, setTab] = useState("agendamentos");

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList>
        <TabsTrigger value="agendamentos">Agendamentos</TabsTrigger>
        <TabsTrigger value="sessoes">Sessões</TabsTrigger>
      </TabsList>
      <TabsContent value="agendamentos" className="mt-6">
        <AgendamentosTable />
      </TabsContent>
      <TabsContent value="sessoes" className="mt-6">
        <SessoesTable />
      </TabsContent>
    </Tabs>
  );
}