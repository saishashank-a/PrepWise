"use client";

import { useState } from "react";
import { STATUS_COLUMNS, ApplicationStatus } from "@/lib/applicationTypes";
import { useApplicationStore } from "@/stores/useApplicationStore";
import ApplicationCard from "./ApplicationCard";
import AddApplicationModal from "./AddApplicationModal";

export default function KanbanBoard() {
  const { getByStatus } = useApplicationStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<ApplicationStatus>("to_apply");

  const openModal = (status: ApplicationStatus) => {
    setModalStatus(status);
    setModalOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {STATUS_COLUMNS.map((col) => {
          const cards = getByStatus(col.key);
          const isOffer = col.key === "offer";

          return (
            <div key={col.key} className="flex flex-col gap-3">
              {/* Column header */}
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold text-[#474747] uppercase tracking-widest">
                  {col.label}
                </span>
                <span className="text-[10px] font-mono bg-[#e6e9e8] text-[#474747] px-2 py-0.5 rounded-full">
                  {cards.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-2 min-h-[120px]">
                {cards.map((app) => (
                  <ApplicationCard key={app.id} app={app} />
                ))}

                {/* Empty offer column */}
                {isOffer && cards.length === 0 && (
                  <div className="border-2 border-dashed border-black/10 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[32px] text-[#ccc] mb-2">
                      emoji_events
                    </span>
                    <p className="text-xs text-[#aaa]">Offers will appear here</p>
                  </div>
                )}
              </div>

              {/* Add button — first column only, or all columns */}
              <button
                onClick={() => openModal(col.key)}
                className="w-full py-2.5 border-2 border-dashed border-black/10 rounded-xl text-[#777] text-xs font-medium
                           hover:border-black/20 hover:text-[#474747] transition-all duration-150 flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[14px]">add</span>
                Add
              </button>
            </div>
          );
        })}
      </div>

      {modalOpen && (
        <AddApplicationModal
          defaultStatus={modalStatus}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
