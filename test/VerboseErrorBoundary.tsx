import * as React from 'react';

interface VerboseErrorState {
    hasError: boolean;
    error?: any;
}

export class VerboseErrorBoundary extends React.Component<unknown, VerboseErrorState> {

    constructor(props: Readonly<unknown>) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error): VerboseErrorState {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div> { this.state.error.toString() } </div>
            );
        }

        return this.props.children;
    }

}
