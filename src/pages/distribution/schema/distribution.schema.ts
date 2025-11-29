import { z } from "zod";

export const memberRoleSchema = z.enum(["chair", "member", "external"]);

export const committeeStatusSchema = z.enum([
  "assigned",
  "pending",
  "completed",
]);

export const committeeMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: memberRoleSchema,
  department: z.string(),
  specialization: z.string(),
});

export const discussionCommitteeSchema = z.object({
  id: z.string(),
  name: z.string(),
  members: z.array(committeeMemberSchema),
  projectId: z.string(),
  projectTitle: z.string(),
  studentName: z.string(),
  scheduledDate: z.string(),
  scheduledTime: z.string(),
  location: z.string(),
  status: committeeStatusSchema,
  createdAt: z.string().optional(),
});

export const createDiscussionCommitteeSchema = discussionCommitteeSchema.omit({
  id: true,
  createdAt: true,
});
export const updateDiscussionCommitteeSchema =
  discussionCommitteeSchema.partial();

export type CommitteeMember = z.infer<typeof committeeMemberSchema>;
export type DiscussionCommittee = z.infer<typeof discussionCommitteeSchema>;
export type CreateDiscussionCommitteeInput = z.infer<
  typeof createDiscussionCommitteeSchema
>;
export type UpdateDiscussionCommitteeInput = z.infer<
  typeof updateDiscussionCommitteeSchema
>;
export type MemberRole = z.infer<typeof memberRoleSchema>;
export type CommitteeStatus = z.infer<typeof committeeStatusSchema>;
