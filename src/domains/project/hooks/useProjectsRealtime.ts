// src/domains/project/hooks/useProjectsRealtime.ts

"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { createWebSocket } from "@/src/lib/websocket/websocket";

type UseProjectsRealtimeOptions = {
  organizationSlug: string | undefined;
  projectIds: string[];
};

type ProjectCache = {
  id: string;
  logCount?: number;
  [key: string]: unknown;
};

type ProjectLogCountUpdatedMessage = {
  type: "project.log_count.updated";
  data?: {
    projectId?: string;
    logCount?: number;
  };
};

const BASE_DELAY_MS = 1_000;
const MAX_DELAY_MS = 30_000;

/**
 * Maintains a single WebSocket connection for the Projects page.
 *
 * The connection subscribes to every visible project. When a
 * `project.log_count.updated` event is received, the corresponding
 * project's log count is updated directly in the React Query cache.
 *
 * The connection automatically reconnects with exponential backoff
 * when it drops unexpectedly.
 */
export function useProjectsRealtime({
  organizationSlug,
  projectIds,
}: UseProjectsRealtimeOptions) {
  const queryClient = useQueryClient();

  const projectIdsRef = useRef(projectIds);
  projectIdsRef.current = projectIds;

  const organizationSlugRef = useRef(organizationSlug);
  organizationSlugRef.current = organizationSlug;

  const queryClientRef = useRef(queryClient);
  queryClientRef.current = queryClient;

  useEffect(() => {
    if (!organizationSlug || projectIds.length === 0) {
      return;
    }

    let intentionallyClosed = false;
    let attempt = 0;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;

    const subscribeAll = (socket: WebSocket) => {
      for (const projectId of projectIdsRef.current) {
        socket.send(
          JSON.stringify({
            type: "project.subscribe",
            data: {
              projectId,
            },
          }),
        );
      }
    };

    const handleMessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data) as ProjectLogCountUpdatedMessage;

        if (message.type !== "project.log_count.updated") {
          return;
        }

        const { projectId, logCount } = message.data ?? {};

        if (!projectId || typeof logCount !== "number") {
          return;
        }

        if (!projectIdsRef.current.includes(projectId)) {
          return;
        }

        const projectsKey = ["projects", organizationSlugRef.current] as const;

        queryClientRef.current.setQueryData<ProjectCache[]>(
          projectsKey,
          (oldProjects) => {
            if (!oldProjects) {
              return oldProjects;
            }

            return oldProjects.map((project) => {
              if (project.id !== projectId) {
                return project;
              }

              return {
                ...project,
                logCount,
              };
            });
          },
        );
      } catch (error) {
        console.error("[WS][Projects] Failed to process message:", error);
      }
    };

    const connect = () => {
      if (intentionallyClosed) {
        return;
      }

      const socket = createWebSocket();

      socket.onopen = () => {
        if (intentionallyClosed) {
          return;
        }

        attempt = 0;

        subscribeAll(socket);
      };

      socket.onmessage = handleMessage;

      socket.onerror = () => {
        if (intentionallyClosed) {
          return;
        }

        console.warn("[WS][Projects] Connection error");
      };

      socket.onclose = () => {
        if (intentionallyClosed) {
          return;
        }

        const delay = Math.min(
          BASE_DELAY_MS * Math.pow(2, attempt),
          MAX_DELAY_MS,
        );

        attempt += 1;

        reconnectTimer = setTimeout(connect, delay);
      };

      return socket;
    };

    const socket = connect();

    return () => {
      intentionallyClosed = true;

      if (reconnectTimer !== undefined) {
        clearTimeout(reconnectTimer);
      }

      if (
        socket &&
        (socket.readyState === WebSocket.OPEN ||
          socket.readyState === WebSocket.CONNECTING)
      ) {
        socket.close();
      }
    };
  }, [organizationSlug, projectIds.length]);
}
