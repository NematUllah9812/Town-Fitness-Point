import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { ScheduleBoard, type ScheduleEntryView } from "@/components/marketing/schedule-board";
import { getSchedule, getClasses, getTrainers } from "@/lib/content";

export const metadata: Metadata = {
  title: "Class Schedule",
  description:
    "Weekly class timetable at Town Fitness Point — filter by class type or trainer. Book your free trial session.",
  alternates: { canonical: "/schedule" },
};

export default async function SchedulePage() {
  const [schedule, classes, trainers] = await Promise.all([
    getSchedule(),
    getClasses(),
    getTrainers(),
  ]);

  const classById = new Map(classes.map((c) => [c.id, c]));
  const trainerById = new Map(trainers.map((t) => [t.id, t]));

  const entries: ScheduleEntryView[] = schedule.map((e) => {
    const cls = classById.get(e.classId);
    const trainer = e.trainerId ? trainerById.get(e.trainerId) : undefined;
    return {
      id: e.id,
      weekday: e.weekday,
      startTime: e.startTime,
      endTime: e.endTime,
      room: e.room,
      trainerId: e.trainerId,
      className: cls?.name ?? "Class",
      classCategory: cls?.category ?? "functional",
      trainerName: trainer?.name ?? null,
    };
  });

  return (
    <>
      <PageHero
        kicker="Timetable"
        title="This Week on the Floor"
        lede="Filter by class type or trainer, then tap a session to book your free trial. Mobile shows day-by-day, desktop shows the full week."
      />
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <ScheduleBoard entries={entries} trainers={trainers} />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
