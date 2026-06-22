export const calculatePosProgress = (current_pos_attempts: number, est_iterations_per_pos_block: number): number => {
    if (!Number.isFinite(current_pos_attempts) || !Number.isFinite(est_iterations_per_pos_block) || est_iterations_per_pos_block <= 0) {
        return 0;
    }

    return Math.min(100, Math.max(0, (current_pos_attempts / est_iterations_per_pos_block) * 100));
};
