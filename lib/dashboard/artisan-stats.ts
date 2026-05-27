import { artisansApi } from "@/services/api/artisans";

import { missionsApi } from "@/services/api/missions";

import type { ArtisanStats, Mission } from "@/types/domain";



function partitionMissions(missions: Mission[]) {

  const completedMissions = missions.filter((m) => m.status === "completed");

  const confirmedMissions = missions.filter((m) =>

    ["confirmed", "in_progress", "waiting_confirmation"].includes(m.status),

  );

  const availableMissions = missions.filter((m) => m.status === "pending");



  const totalRevenue = completedMissions.reduce(

    (acc, m) => acc + (Number(m.price) || 0),

    0,

  );



  const now = new Date();

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthlyRevenue = completedMissions

    .filter(

      (m) =>

        (m.completed_at && new Date(m.completed_at) >= startOfMonth) ||

        (m.scheduled_at && new Date(m.scheduled_at) >= startOfMonth),

    )

    .reduce((acc, m) => acc + (Number(m.price) || 0), 0);



  const startOfWeek = new Date(now);

  startOfWeek.setDate(now.getDate() - 7);

  const weeklyMissionsCount = missions.filter(

    (m) => m.created_at && new Date(m.created_at) >= startOfWeek,

  ).length;



  const uniqueClients = new Set(missions.map((m) => m.customer_name)).size;



  return {

    totalRevenue,

    monthlyRevenue,

    weeklyMissionsCount,

    activeClients: uniqueClients,

    recentMissions: [...missions]

      .sort(

        (a, b) =>

          new Date(b.created_at || 0).getTime() -

          new Date(a.created_at || 0).getTime(),

      )

      .slice(0, 5),

    confirmedMissions,

    availableMissions,

  };

}



export async function buildArtisanStats(

  token: string,

  _artisanId: string,

): Promise<ArtisanStats> {

  let apiStats: Partial<ArtisanStats> = {};

  try {

    const raw = await artisansApi.getStats(token);

    apiStats = {

      totalRevenue: raw.totalRevenue,

      totalGmv: raw.totalGmv,
      monthlyRevenue: raw.monthlyRevenue,

      weeklyMissionsCount: raw.weeklyMissionsCount,

      activeClients: raw.activeClients,

    };

  } catch {

    // fallback calcul local

  }



  let missions: Mission[] = [];

  try {

    missions = await missionsApi.list(token, {

      role: "artisan",

      limit: 100,

    });

  } catch {

    try {

      missions = await missionsApi.list(token, { artisan_id: _artisanId });

    } catch {

      missions = [];

    }

  }



  const computed = partitionMissions(missions);



  return {

    totalRevenue: apiStats.totalRevenue ?? computed.totalRevenue,

    totalGmv: apiStats.totalGmv,

    monthlyRevenue: apiStats.monthlyRevenue ?? computed.monthlyRevenue,

    weeklyMissionsCount:

      apiStats.weeklyMissionsCount ?? computed.weeklyMissionsCount,

    activeClients: apiStats.activeClients ?? computed.activeClients,

    recentMissions: computed.recentMissions,

    confirmedMissions: computed.confirmedMissions,

    availableMissions: computed.availableMissions,

  };

}

