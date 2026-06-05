export const calculatePosEstimateSec = (current_pos_attempts: number, est_iterations_per_pos_block: number): number => {
    if (!Number.isFinite(current_pos_attempts) || !Number.isFinite(est_iterations_per_pos_block) || est_iterations_per_pos_block <= 0) {
        return 0;
    }

    return Math.max(est_iterations_per_pos_block - current_pos_attempts, 0) * 2;
};
